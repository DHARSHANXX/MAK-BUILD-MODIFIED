Get-Content -Path .\app.js | Select-String -Pattern 'switchBaProject' | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
