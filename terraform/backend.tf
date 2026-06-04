terraform {
  backend "s3" {
    bucket         = "ecs-state-bket"
    key            = "terraform.tfstate"
    region         = "us-east-1"
  }
}
