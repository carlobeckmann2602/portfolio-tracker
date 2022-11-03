# iOS App

## Building
Opening the project straight in XCode should work

## Code format

The source code is formatted with `swift-format`. To format the source code, run: 
```shell
swift-format . --recursive -i
```

You can install swift-format using Homebrew. If that does not work, you can also build it easily from source:
```shell
VERSION=0.50700.1
git clone https://github.com/apple/swift-format.git
cd swift-format
git checkout "tags/$VERSION"
swift build -c release
```
The executable `swift-format` will be in `.build/release`, then you can add it to your `$PATH`