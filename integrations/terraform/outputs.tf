output "function_app_hostname" {
    value       = azurerm_linux_function_app.function_app.default_hostname
    description = "Deployed function app hostname"
}

output "function_app_host_keys" {
    value       = data.azurerm_function_app_host_keys.host_keys.default_function_key
    description = "Deployed function app function key"
    sensitive   = true
}

output "cosmosdb_connection_string" {
    value       = azurerm_cosmosdb_account.cosmosdb_account.connection_strings[0]
    description = "Deployed cosmosdb connection string"
    sensitive   = true
}
