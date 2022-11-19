- Using Example
    ```go
    appLogger := logger.AppLogger
    appLogger.Debug("debug log test", zap.String("param", "http"))
    appLogger.Info("info log test")
    appLogger.Warn("warn test")
    appLogger.Error("error test")
    ```