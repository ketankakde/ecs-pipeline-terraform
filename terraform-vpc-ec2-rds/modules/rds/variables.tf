variable "identifier" {
 default = "mysql-db"
}

variable "engine" {
 default = "mysql" 
}

variable "engine_version" {
 default = "8.0"
}

variable "instance_class" {
 default = "db.t4g.micro"
}

variable "allocated_storage" {
 default = 20
 type = number
}

variable "db_name" {
 default = "student_registration"
}

variable "username" {
 default = "root"
}

variable "password" {
 default = "password123"
}

variable "vpc_id" {}
variable "private_subnet_id" {}
variable "private_2_id" {}
variable "ec2_sg_id" {}
