package main

import (
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    
    r.Any("/api/crm/*path", func(c *gin.Context) {
        // Reverse proxy logic to 8081 would go here
        c.JSON(200, gin.H{"status": "proxied", "target": "crm"})
    })

    r.Run(":8080") // API Gateway listens on 8080
}
