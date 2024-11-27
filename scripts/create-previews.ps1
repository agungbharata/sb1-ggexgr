$templates = @(
    "javanese.jpg",
    "sundanese.jpg",
    "minang.jpg",
    "bali.jpg",
    "modern.jpg"
)

$previewsPath = Join-Path $PSScriptRoot "..\public\previews"
if (-not (Test-Path $previewsPath)) {
    New-Item -ItemType Directory -Path $previewsPath
}

foreach ($template in $templates) {
    $output = Join-Path $previewsPath $template
    # Create an empty file
    New-Item -ItemType File -Path $output -Force
    Write-Host "Created $template"
}
