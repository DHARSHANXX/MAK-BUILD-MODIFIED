Get-Content -Path .\app.js | Select-String -Pattern 'baProjects' | ForEach-Object { "$($_.LineNumber): $($_.Line.Trim())" }
