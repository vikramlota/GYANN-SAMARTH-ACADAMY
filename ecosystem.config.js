{
  "apps": [
    {
      "name": "samarth-api",
      "script": "./src/index.js",
      "cwd": "./Backend",
      "env": {
        "NODE_ENV": "production",
        "PORT": 5000
      },
      "instances": "max",
      "exec_mode": "cluster",
      "error_file": "logs/error.log",
      "out_file": "logs/out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "merge_logs": true,
      "max_memory_restart": "500M",
      "restart_delay": 4000,
      "max_restarts": 10
    }
  ]
}
