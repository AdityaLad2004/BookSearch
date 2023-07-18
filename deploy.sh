echo "Switching to branch master"
git checkout master

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* adi@4.213.92.251:/var/www/4.213.92.251/

echo "Done"