resource "aws_ecr_repository" "frontend" {
  name = var.frontend_repo_name

  image_scanning_configuration {
    scan_on_push = true
  }

  force_delete = true
}

resource "aws_ecr_repository" "backend" {
  name = var.backend_repo_name

  image_scanning_configuration {
    scan_on_push = true
  }

  force_delete = true
}
