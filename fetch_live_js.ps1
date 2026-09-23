$res = Invoke-WebRequest -Uri 'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/app.js' -UseBasicParsing
$js = $res.Content
$idx = $js.IndexOf('function switchBaProject')
Write-Host "switchBaProject idx: $idx"
if ($idx -ge 0) {
    Write-Host $js.Substring($idx, [Math]::Min(1500, $js.Length - $idx))
}
