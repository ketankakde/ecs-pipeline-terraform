module "vpc" {
  source = "./modules/vpc"
}

module "iam" {
  source = "./modules/iam"
}

module "ec2" {
  source = "./modules/ec2"

  vpc_id        = module.vpc.vpc_id
  subnet_id     = module.vpc.public_subnet_id
  instance_profile_name = module.iam.instance_profile_name
}

module "ecr" {
  source = "./modules/ecr"
}

module "rds" {
  source = "./modules/rds"

  vpc_id            = module.vpc.vpc_id
  private_subnet_id = module.vpc.private_subnet_id
  private_2_id = module.vpc.private_2_id
  ec2_sg_id         = module.ec2.ec2_sg_id
}
