Get-Content -Path .\app.js | Select-String -Pattern 'setBaPosition' | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
