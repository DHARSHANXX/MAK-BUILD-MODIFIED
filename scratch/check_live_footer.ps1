$res = Invoke-WebRequest -Uri 'https://dharshanxx.github.io/MAK-BUILD-MODIFIED/index.html' -UseBasicParsing
$liveHtml = $res.Content
$idx = $liveHtml.IndexOf('Send Inquiry to MAK BUILD')
if ($idx -ne -1) {
    $sub = $liveHtml.Substring($idx, [Math]::Min(1500, $liveHtml.Length - $idx))
    Write-Output $sub
} else {
    Write-Output "String not found"
}
