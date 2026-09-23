Get-Content -Path .\app.js | Select-String -Pattern 'consultation-form' | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
