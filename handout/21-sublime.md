# Part 21: [Sublime Text](http://www.sublimetext.com/)
Cross platform text editor for code. Available for an unlimited free trail period. Its strength comes from the large number of plugins available.  

## How to Install
1. Go to http://www.sublimetext.com/
2. Click download
3. Run the installer

## Some Useful Plugins
- [Package Control](https://packagecontrol.io/): Allows for easy installation, management, and discovery of other plugins. This should be installed first since it will be used to install all the other plugins.
- [Bracket Highlighter](https://packagecontrol.io/packages/BracketHighlighter): Match currently selected bracket with its openning/closing bracket
- [Editor Config](https://packagecontrol.io/packages/EditorConfig): Allows for everyone  to use the same text format across 'all' editors for the same project
- [Sublime Lint](https://packagecontrol.io/packages/sublimelint): jslint current project. Can be configured to run whenever a file is saved

## How to Install Package Control
1. Select ```View > Show Console```
2. Copy-paste  the following snippet
```
import urllib2,os,hashlib;
h = '2deb499853c4371624f5a07e27c334aa' + 'bf8c4e67d14fb0525ba4f89698a6d7e1';
pf = 'Package Control.sublime-package';
ipp = sublime.installed_packages_path();
os.makedirs( ipp )
if not os.path.exists(ipp) else None;
urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler()) );
by = urllib2.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read();
dh = hashlib.sha256(by).hexdigest();
open( os.path.join( ipp, pf), 'wb' ).write(by) if dh == h else None;
print('Error validating download (got %s instead of %s), please try manual install'
 % (dh, h) if dh != h else 'Please restart Sublime Text to finish installation')
```
__Note__: The above code was retrieved Jan 29, 2015. The code may have since changed to point to the most recent version of the package. The latest code is available at https://packagecontrol.io/installation

## How to Install Packages Using Package Control
1. Open the Sublime command pallete: ```ctrl+shift+p``` (Win, Linux) or ```cmd+shift+p``` (OS X)
2. Enter/select ```Package Control: Install Package```
3. Finally a list of avaliable packages will appear, where the desired package can be entered/selected (ex: sublimelint, editorconfig, brackethighlighter )

## Perfectly Suitable Editor Alternatives
- [Atom](https://atom.io/): Very similar to Sublime, but it's open-source and has very good native github integration.
- [WebStorm](https://www.jetbrains.com/webstorm/): Paid full IDE for web and node development.
- Emacs or Vim: Oldschool terminal text editors.
- [Visual Studio](http://www.visualstudio.com/en-us/products/visual-studio-community-vs) with [NodeJS Tools](http://nodejstools.codeplex.com/): Windows only, free and paid full IDE that has improved its web and nodejs support/features in the past few years.
