@echo off
REM generate-tiles.bat - Windows batch script for tile generation

echo 🗺️  NASA Image Tile Generator for Windows

REM Check if GDAL is installed
where gdalinfo >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ GDAL not found in PATH
    echo Please install GDAL from: https://www.gisinternals.com/
    echo Add GDAL bin directory to your PATH
    pause
    exit /b 1
)

echo ✅ GDAL found

REM Create directories
if not exist "source-images" mkdir "source-images"
if not exist "tiles" mkdir "tiles"
if not exist "temp" mkdir "temp"

echo 📁 Directories ready

REM Check for TIF files
set "source_dir=source-images"
set "tif_count=0"

for %%f in ("%source_dir%\*.tif" "%source_dir%\*.tiff") do (
    if exist "%%f" set /a tif_count+=1
)

if %tif_count%==0 (
    echo 📂 No TIF files found in %source_dir%
    echo 💡 Place your NASA .tif files in the source-images directory
    pause
    exit /b 1
)

echo 🔍 Found %tif_count% TIF file(s)

REM Set default zoom levels
set "min_zoom=0"
set "max_zoom=12"

REM Parse command line arguments
:parse_args
if "%~1"=="" goto start_processing
if "%~1"=="--min-zoom" (
    set "min_zoom=%~2"
    shift
    shift
    goto parse_args
)
if "%~1"=="--max-zoom" (
    set "max_zoom=%~2"
    shift
    shift
    goto parse_args
)
shift
goto parse_args

:start_processing
echo 📊 Zoom levels: %min_zoom% to %max_zoom%
echo.

REM Process each TIF file
for %%f in ("%source_dir%\*.tif" "%source_dir%\*.tiff") do (
    if exist "%%f" (
        echo 🌍 Processing: %%~nxf
        
        REM Get filename without extension
        set "filename=%%~nf"
        
        REM Reproject to Web Mercator
        echo 🔄 Reprojecting to Web Mercator...
        gdalwarp -t_srs EPSG:3857 -r lanczos "%%f" "temp\!filename!_3857.tif"
        
        if exist "temp\!filename!_3857.tif" (
            echo ✅ Reprojection successful
            
            REM Generate tiles
            echo 🎯 Generating tiles...
            gdal2tiles.py -p mercator -r lanczos -z %min_zoom%-%max_zoom% --processes=2 "temp\!filename!_3857.tif" "tiles"
            
            if %ERRORLEVEL%==0 (
                echo ✅ Tiles generated successfully
            ) else (
                echo ❌ Error generating tiles for %%~nxf
            )
            
            REM Clean up temp file
            del "temp\!filename!_3857.tif"
        ) else (
            echo ❌ Reprojection failed for %%~nxf
        )
        echo.
    )
)

echo 🎉 Processing complete!
echo 📁 Tiles are available in the 'tiles' directory
echo 🌐 Start your server with: npm start
echo.

REM Clean up temp directory
rmdir /s /q "temp" 2>nul

pause