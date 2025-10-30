# Deployment en AWS - Dale Rides Platform

Esta guía cubre el deployment completo de Dale Rides Platform en Amazon Web Services (AWS) utilizando servicios administrados para escalabilidad, confiabilidad y seguridad empresarial.

## ✅ Prerequisites

### Cuenta AWS
- [x] Cuenta AWS con billing habilitado
- [x] AWS CLI configurado (`aws configure`)
- [x] AWS CDK o Terraform instalado (opcional)
- [x] Conocimientos básicos de AWS

### Services Requeridos
- **ECS Fargate** - Orquestación de containers
- **Application Load Balancer** - Balanceador de carga
- **CloudFront + S3** - CDN para frontend
- **RDS (opcional)** - Base de datos si no usas Supabase
- **ElastiCache (Redis)** - Cache managed
- **Certificate Manager** - SSL/TLS
- **Route 53** - DNS (opcional)

### IAM Permissions
El usuario/rol debe tener permisos para:
- ECS, ECR, ALB, CloudFront, S3, RDS, ElastiCache, ACM, Route 53
- CloudFormation (si usas Infrastructure as Code)

## 🏗️ Arquitectura Recomendada

```
Internet → CloudFront → S3 (Frontend) 
                ↓
          ALB → ECS Fargate (Backend)
                ↓
          ElastiCache (Redis)
                ↓
          External: Supabase Database
```

### Alternativa sin Supabase (Full AWS)
```
Internet → CloudFront → ALB → ECS Fargate (Frontend)
                        ↓
                RDS PostgreSQL
```

## 🚀 Deployment con ECS Fargate

### 1. Preparación del Entorno

```bash
# Instalar AWS CLI y ECS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# ECS CLI
sudo curl -LO https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-linux-amd64-latest
sudo mv ecs-cli-linux-amd64-latest /usr/local/bin/ecs-cli
sudo chmod +x /usr/local/bin/ecs-cli

# Configurar AWS
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: us-east-1
# Default output format: json

# Verificar configuración
aws sts get-caller-identity
```

### 2. Crear ECR Repositories

```bash
# Variables
AWS_REGION=us-east-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI="$ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

# Crear repositorios
aws ecr create-repository --repository-name dale-backend --region $AWS_REGION
aws ecr create-repository --repository-name dale-frontend --region $AWS_REGION

# Configurar login
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

# Build y push images
cd backend
docker build -t dale-backend .
docker tag dale-backend:latest $ECR_URI/dale-backend:latest
docker push $ECR_URI/dale-backend:latest

cd ../frontend
docker build -t dale-frontend .
docker tag dale-frontend:latest $ECR_URI/dale-frontend:latest
docker push $ECR_URI/dale-frontend:latest
```

### 3. Configuración de ECS

#### Task Definition (backend)

```json
{
  "family": "dale-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "taskRoleArn": "arn:aws:iam::$ACCOUNT_ID:role/ecsTaskRole",
  "executionRoleArn": "arn:aws:iam::$ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "$ECR_URI/dale-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "SUPABASE_URL",
          "valueFrom": "arn:aws:ssm:$AWS_REGION:$ACCOUNT_ID:parameter/dale/supabase/url"
        },
        {
          "name": "SUPABASE_SERVICE_ROLE_KEY",
          "valueFrom": "arn:aws:ssm:$AWS_REGION:$ACCOUNT_ID:parameter/dale/supabase/service-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/dale-backend",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:8000/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### Task Definition (frontend)

```json
{
  "family": "dale-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "$ECR_URI/dale-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "NEXT_PUBLIC_SUPABASE_URL",
          "valueFrom": "arn:aws:ssm:$AWS_REGION:$ACCOUNT_ID:parameter/dale/supabase/url"
        },
        {
          "name": "NEXT_PUBLIC_SUPABASE_ANON_KEY",
          "valueFrom": "arn:aws:ssm:$AWS_REGION:$ACCOUNT_ID:parameter/dale/supabase/anon-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/dale-frontend",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 4. Crear Infrastructure con CloudFormation

#### VPC y Networking

```yaml
# network-stack.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Dale Platform - VPC Network Stack'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues: [development, staging, production]

Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-vpc'

  InternetGateway:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-igw'

  InternetGatewayAttachment:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      InternetGatewayId: !Ref InternetGateway
      VpcId: !Ref VPC

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [0, !GetAZs '']
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-public-subnet-1'

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [1, !GetAZs '']
      CidrBlock: 10.0.2.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-public-subnet-2'

  PrivateSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [0, !GetAZs '']
      CidrBlock: 10.0.3.0/24
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-private-subnet-1'

  PrivateSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      AvailabilityZone: !Select [1, !GetAZs '']
      CidrBlock: 10.0.4.0/24
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-private-subnet-2'

  NatGateway1EIP:
    Type: AWS::EC2::EIP
    DependsOn: InternetGatewayAttachment
    Properties:
      Domain: vpc

  NatGateway2EIP:
    Type: AWS::EC2::EIP
    DependsOn: InternetGatewayAttachment
    Properties:
      Domain: vpc

  NatGateway1:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGateway1EIP.AllocationId
      SubnetId: !Ref PublicSubnet1
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-nat-1'

  NatGateway2:
    Type: AWS::EC2::NatGateway
    Properties:
      AllocationId: !GetAtt NatGateway2EIP.AllocationId
      SubnetId: !Ref PublicSubnet2
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-nat-2'

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-public-routes'

  DefaultPublicRoute:
    Type: AWS::EC2::Route
    DependsOn: InternetGatewayAttachment
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnet1RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PublicRouteTable
      SubnetId: !Ref PublicSubnet1

  PublicSubnet2RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PublicRouteTable
      SubnetId: !Ref PublicSubnet2

  PrivateRouteTable1:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-private-routes-1'

  DefaultPrivateRoute1:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable1
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway1

  PrivateSubnet1RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PrivateRouteTable1
      SubnetId: !Ref PrivateSubnet1

  PrivateRouteTable2:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-dale-private-routes-2'

  DefaultPrivateRoute2:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId: !Ref PrivateRouteTable2
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId: !Ref NatGateway2

  PrivateSubnet2RouteTableAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId: !Ref PrivateRouteTable2
      SubnetId: !Ref PrivateSubnet2

Outputs:
  VPCId:
    Description: VPC ID
    Value: !Ref VPC
    Export:
      Name: !Sub '${Environment}-dale-vpc-id'

  PublicSubnetIds:
    Description: Public Subnet IDs
    Value: !Join [',', [!Ref PublicSubnet1, !Ref PublicSubnet2]]
    Export:
      Name: !Sub '${Environment}-dale-public-subnet-ids'

  PrivateSubnetIds:
    Description: Private Subnet IDs
    Value: !Join [',', [!Ref PrivateSubnet1, !Ref PrivateSubnet2]]
    Export:
      Name: !Sub '${Environment}-dale-private-subnet-ids'
```

#### ECS Cluster Stack

```yaml
# ecs-stack.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Dale Platform - ECS Stack'

Parameters:
  Environment:
    Type: String
    Default: production
  VPCStackName:
    Type: String
    Default: network-stack

Resources:
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Sub '${Environment}-dale-cluster'
      CapacityProviders:
        - FARGATE
        - FARGATE_SPOT
      DefaultCapacityProviderStrategy:
        - CapacityProvider: FARGATE
          Weight: 80
        - CapacityProvider: FARGATE_SPOT
          Weight: 20

  # Security Groups
  ALBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for ALB
      VpcId: !ImportValue
        Fn::Sub: '${VPCStackName}-VPCId'
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 443
          ToPort: 443
          CidrIp: 0.0.0.0/0

  ECSSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for ECS tasks
      VpcId: !ImportValue
        Fn::Sub: '${VPCStackName}-VPCId'
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 8000
          ToPort: 8000
          SourceSecurityGroupId: !Ref ALBSecurityGroup

  # Application Load Balancer
  ApplicationLoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: !Sub '${Environment}-dale-alb'
      Scheme: internet-facing
      Type: application
      SecurityGroups:
        - !Ref ALBSecurityGroup
      Subnets: !Split
        - ','
        - !ImportValue
          Fn::Sub: '${VPCStackName}-PublicSubnetIds'

  ALBListener:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      DefaultActions:
        - Type: forward
          TargetGroupArn: !Ref ALBTargetGroup
      LoadBalancerArn: !Ref ApplicationLoadBalancer
      Port: 80
      Protocol: HTTP

  ALBTargetGroup:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      Name: !Sub '${Environment}-dale-targets'
      Port: 8000
      Protocol: HTTP
      VpcId: !ImportValue
        Fn::Sub: '${VPCStackName}-VPCId'
      TargetType: ip
      HealthCheckEnabled: true
      HealthCheckPath: /health
      HealthCheckProtocol: HTTP
      HealthCheckPort: traffic-port
      HealthCheckIntervalSeconds: 30
      HealthCheckTimeoutSeconds: 5
      HealthyThresholdCount: 2
      UnhealthyThresholdCount: 3
      TargetGroupAttributes:
        - Key: deregistration_delay.timeout_seconds
          Value: '30'

  # ECS Service
  ECSService:
    Type: AWS::ECS::Service
    Properties:
      ServiceName: !Sub '${Environment}-dale-backend-service'
      Cluster: !Ref ECSCluster
      TaskDefinition: !Ref TaskDefinition
      DesiredCount: 2
      LaunchType: FARGATE
      NetworkConfiguration:
        AwsvpcConfiguration:
          SecurityGroups:
            - !Ref ECSSecurityGroup
          Subnets: !Split
            - ','
            - !ImportValue
              Fn::Sub: '${VPCStackName}-PrivateSubnetIds'
      LoadBalancers:
        - ContainerName: backend
          ContainerPort: 8000
          TargetGroupArn: !Ref ALBTargetGroup

  # CloudWatch Log Groups
  BackendLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub '/ecs/${Environment}-dale-backend'
      RetentionInDays: 30

Outputs:
  ClusterName:
    Description: ECS Cluster Name
    Value: !Ref ECSCluster
    Export:
      Name: !Sub '${Environment}-dale-cluster-name'

  ALBDNSName:
    Description: ALB DNS Name
    Value: !GetAtt ApplicationLoadBalancer.DNSName
    Export:
      Name: !Sub '${Environment}-dale-alb-dns'
```

### 5. Deploy con CDK (TypeScript)

```typescript
// cdk-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class DaleStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import VPC from network stack
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcId: cdk.Fn.importValue('network-stack-VPCId'),
    });

    // Create ECS Cluster
    const cluster = new ecs.Cluster(this, 'DaleCluster', {
      clusterName: 'dale-production',
      vpc: vpc,
      capacityProviders: [
        new ecs.AsgCapacityProvider(this, 'FargateCapacityProvider', {
          capacityProviderName: 'FARGATE',
          targetCapacityPercent: 80,
        }),
        new ecs.AsgCapacityProvider(this, 'FargateSpotCapacityProvider', {
          capacityProviderName: 'FARGATE_SPOT',
          targetCapacityPercent: 20,
        }),
      ],
    });

    // Create Security Groups
    const albSecurityGroup = new ec2.SecurityGroup(this, 'ALBSecurityGroup', {
      vpc,
      description: 'Security group for ALB',
      allowAllOutbound: true,
    });

    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'Allow HTTP traffic'
    );

    albSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'Allow HTTPS traffic'
    );

    // Create Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'DaleALB', {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
    });

    const listener = alb.addListener('Listener', {
      port: 80,
      open: true,
    });

    const targetGroup = listener.addTargets('ECS_Target', {
      port: 8000,
      healthCheck: {
        path: '/health',
        interval: cdk.Duration.seconds(30),
      },
    });

    // Create ECS Service
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'DaleTaskDefinition', {
      cpu: 512,
      memory: 1024,
    });

    const container = taskDefinition.addContainer('DaleBackend', {
      image: ecs.ContainerImage.fromEcrRepository(
        ecr.Repository.fromRepositoryName(this, 'BackendRepo', 'dale-backend')
      ),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'ecs',
        logRetention: 30,
      }),
      environment: {
        ENV: 'production',
      },
    });

    container.addPortMappings({
      containerPort: 8000,
      protocol: ecs.Protocol.TCP,
    });

    new ecs.FargateService(this, 'DaleService', {
      cluster,
      taskDefinition,
      desiredCount: 2,
      serviceName: 'dale-backend-service',
    });

    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
    });
  }
}
```

## 🌐 Frontend con CloudFront + S3

### 1. Crear S3 Bucket

```bash
# Crear bucket para frontend
aws s3 mb s3://dale-frontend-production --region us-east-1

# Configurar bucket para static hosting
aws s3 website s3://dale-frontend-production \
  --index-document index.html \
  --error-document index.html

# Política para CloudFront
cat > cloudfront-policy.json << EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::dale-frontend-production/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket dale-frontend-production --policy file://cloudfront-policy.json
```

### 2. CloudFront Distribution

```bash
# Crear distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json

# cloudfront-config.json
{
  "CallerReference": "dale-frontend-2024",
  "DefaultCacheBehavior": {
    "TargetOriginId": "dale-s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": true,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "dale-s3-origin",
        "DomainName": "dale-frontend-production.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "Enabled": true,
  "Comment": "Dale Platform Frontend Distribution",
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponseCode": "200",
        "ResponsePagePath": "/index.html"
      }
    ]
  }
}
```

### 3. Deploy Frontend

```bash
# Build y deploy
cd frontend
npm run build

# Sincronizar con S3
aws s3 sync out/ s3://dale-frontend-production --delete

# Invalidar CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

## 🔐 SSL/TLS con Certificate Manager

### 1. Solicitar Certificado

```bash
# Crear certificado para dominio
aws acm request-certificate \
  --domain-name tu-dominio.com \
  --subject-alternative-names www.tu-dominio.com \
  --validation-method DNS \
  --region us-east-1

# Note el CertificateArn para configurar DNS validation
```

### 2. Configurar DNS Validation

```bash
# Crear hosted zone en Route 53
aws route53 create-hosted-zone --name tu-dominio.com --caller-reference $(date +%s)

# Agregar registros de validación (usar valores del ACM)
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://validation-records.json

# validation-records.json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "_random-string.tu-dominio.com",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "_random-string.acm-validations.aws."
          }
        ]
      }
    }
  ]
}
```

## 📊 Monitoreo con CloudWatch

### 1. Dashboards

```bash
# Crear dashboard
aws cloudwatch put-dashboard --dashboard-name "Dale-Platform-Production" --dashboard-body file://dashboard.json

# dashboard.json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ECS", "CPUUtilization", "ServiceName", "dale-backend-service"],
          [".", "MemoryUtilization", ".", "."]
        ],
        "period": 300,
        "stat": "Average",
        "region": "us-east-1",
        "title": "ECS Service Metrics"
      }
    },
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["AWS/ApplicationELB", "RequestCountPerTarget", "LoadBalancer", "app/dale-alb"],
          [".", "TargetResponseTime", ".", "."]
        ],
        "period": 300,
        "stat": "Sum",
        "region": "us-east-1",
        "title": "ALB Metrics"
      }
    }
  ]
}
```

### 2. Alarms

```bash
# Alarma para CPU alta
aws cloudwatch put-metric-alarm \
  --alarm-name "Dale-Backend-High-CPU" \
  --alarm-description "Alarm when backend CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:dale-alerts

# Alarma para errores 5xx
aws cloudwatch put-metric-alarm \
  --alarm-name "Dale-Backend-5xx-Errors" \
  --alarm-description "Alarm when 5xx errors exceed 10" \
  --metric-name HTTPCode_Target_5XX_Count \
  --namespace AWS/ApplicationELB \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:dale-alerts
```

## 🔄 CI/CD con CodePipeline

### Pipeline Configuration

```yaml
# buildspec.yml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_URI
  build:
    commands:
      - echo Build started on `date`
      - echo Building backend...
      - cd backend
      - docker build -t $ECR_URI/dale-backend:$CODEBUILD_RESOLVED_SOURCE_VERSION .
      - docker push $ECR_URI/dale-backend:$CODEBUILD_RESOLVED_SOURCE_VERSION
      - echo Building frontend...
      - cd ../frontend
      - npm ci
      - npm run build
      - aws s3 sync out/ s3://$FRONTEND_BUCKET --delete
      - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Updating ECS service...
      - aws ecs update-service --cluster dale-production --service dale-backend-service --force-new-deployment
artifacts:
  files:
    - '**/*'
  base-directory: 'backend'
cache:
  paths:
    - '/root/.cache/**/*'
    - 'frontend/node_modules/**/*'
```

## 💰 Estimación de Costos (us-east-1)

### Monthly Cost Estimate (Small-Medium Scale)

| Service | Configuration | Cost/Month |
|---------|---------------|------------|
| ECS Fargate | 2 tasks (512 CPU, 1GB RAM) | $40-60 |
| ALB | 1 load balancer | $20-25 |
| CloudFront | 100GB transfer | $8-12 |
| S3 | 10GB storage + 100GB transfer | $2-5 |
| ElastiCache | t3.micro (test) / t3.small (prod) | $15-30 |
| Route 53 | DNS hosting | $0.50 |
| Data Transfer | 500GB egress | $40-50 |
| **Total** | | **$125-182** |

### Cost Optimization Tips

```bash
# 1. Usar Spot Instances para desarrollo
# 2. Configurar Auto Scaling basado en métricas
# 3. Usar CloudWatch cost alerts
# 4. Reservar instancias para cargas estables
# 5. Configurar lifecycle policies en S3
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. ECS Tasks no inician

```bash
# Verificar logs de tareas
aws logs get-log-events --log-group-name /ecs/dale-backend --log-stream-name ecs/dale-backend/xxxx

# Verificar status del servicio
aws ecs describe-services --cluster dale-production --services dale-backend-service

# Verificar task definition
aws ecs describe-task-definition --task-definition dale-backend
```

#### 2. ALB Health Checks fallan

```bash
# Verificar target group health
aws elbv2 describe-target-health --target-group-arn arn:aws:elasticloadbalancing:...

# Verificar security groups
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx

# Test manual de conectividad
curl -I http://tu-alb-dns.amazonaws.com/health
```

#### 3. CloudFront no sirve contenido

```bash
# Verificar distribution status
aws cloudfront get-distribution --id E1234567890ABC

# Verificar S3 bucket policy
aws s3api get-bucket-policy --bucket dale-frontend-production

# Invalidar cache manualmente
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```

#### 4. Variables de entorno en ECS

```bash
# Verificar Parameter Store
aws ssm get-parameter --name /dale/supabase/url --with-decryption

# Verificar task definition
aws ecs describe-task-definition --task-definition dale-backend

# Actualizar service después de cambios
aws ecs update-service --cluster dale-production --service dale-backend-service --force-new-deployment
```

## 📚 Recursos Adicionales

### Documentation
- [AWS ECS Developer Guide](https://docs.aws.amazon.com/ecs/)
- [ECS Best Practices](https://docs.aws.amazon.com/whitepapers/latest/real-time-server-compute-using-aws-fargate/real-time-server-compute-using-aws-fargate.html)
- [AWS CDK Guide](https://docs.aws.amazon.com/cdk/)
- [CloudFormation](https://docs.aws.amazon.com/cloudformation/)

### Tools
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS CDK Toolkit](https://docs.aws.amazon.com/cdk/)
- [ECS CLI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI.html)
- [AWS Copilot](https://aws.amazon.com/containers/copilot/) - Simplified deployment

### Community
- [AWS Container Services](https://aws.amazon.com/containers/)
- [AWS Architecture Center](https://aws.amazon.com/architecture/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

---

**Última actualización**: Diciembre 2024
**Compatible con**: AWS CLI v2, CDK v2, ECS Fargate
**Regiones recomendadas**: us-east-1, us-west-2, eu-west-1
