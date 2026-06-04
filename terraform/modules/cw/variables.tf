variable "name" {
 default = "/ecs/3Tapp"
}

variable "endpoint" {
 default = "ketankakde93gmail.com"
}

variable "alarm_name" {
 default = "ecs-cpu-high"
}

variable "metric_name" {
 default = "CPUUtilization"
}

variable "namespace" {
 default = "AWS/ECS"
}

variable "period" {
 default = 300
 type = number
}

variable "statistic" {
 default = "Average"
}

variable "threshold" {
 default = 50
 type = number
}

variable "cluster_name" {
 default = "3T-ECS"
}

variable "service_name" {
 default = "3T-ECS-Service"
}  
