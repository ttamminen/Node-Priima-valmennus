require 'susy'

# Set this to the root of your project when deployed:
css_dir = 'out/styles'
sass_dir = 'src/documents/styles'
images_dir = 'src/documents/images' #'app/images'
http_images_dir = 'app/images'
generated_images_dir = "src/documents/images/sprites"
http_generated_images_path = "/images/sprites"
javascripts_dir = 'temp/scripts'
fonts_dir = 'app/fonts'

# Make a copy of sprites with a name that has no uniqueness of the hash.
on_sprite_saved do |filename|
  if File.exists?(filename)
    FileUtils.cp filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '.png')
  end
end

# Replace in stylesheets generated references to sprites
# by their counterparts without the hash uniqueness.
on_stylesheet_saved do |filename|
  if File.exists?(filename)
    css = File.read filename
    File.open(filename, 'w+') do |f|
      f << css.gsub(%r{-s[a-z0-9]{10}\.png}, '.png')
    end
  end
end