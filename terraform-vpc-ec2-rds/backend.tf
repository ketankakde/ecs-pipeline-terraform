terraform {
  backend "s3" {
    bucket         = "state-bket"
    key            = "terraform.tfstate"
    region         = "us-east-1"
  }
}
