$res = Invoke-WebRequest -Uri 'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/app.js' -UseBasicParsing
$js = $res.Content
$idx = $js.IndexOf('BA_PROJECTS = {')
Write-Host "BA_PROJECTS idx: $idx"
if ($idx -ge 0) {
    Write-Host $js.Substring($idx, [Math]::Min(1200, $js.Length - $idx))
}
