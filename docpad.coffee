# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
  templateData:
    # Specify some site properties
    site:
      # The production url of our website
      url: "http://priimavalmennus.fi"

      # The default title of our website
      title: "Priima-valmennus"

      # The website description (for SEO)
      description: """
        Priima-valmennus tarjoaa yksityisille ja yrityksille Personal Trainer palveluita pääkaupunkiseudulla
        """

      # The website keywords (for SEO) separated by commas
      keywords: """
        personal trainer, kerava, helsinki, vantaa, tuusula, järvenpää, sipoo, nurmijärvi
        """

      # The website author's name
      author: "Vera Tamminen"

      # The website author's email
      email: "vera@priimavalmennus.fi"

      # Your company's name
      copyright: "© Priima-valmennus 2013"

    # -----------------------------
    # Helper Functions

    # Get the prepared site/document title
    # Often we would like to specify particular formatting to our page's title
    # we can apply that formatting here
    getPreparedTitle: ->
      # if we have a document title, then we should use that and suffix the site's title onto it
      if @document.title
        "#{@document.title} | #{@site.title}"
      # if our document does not have it's own title, then we should just use the site's title
      else
        @site.title

    # Get the prepared site/document description
    getPreparedDescription: ->
      # if we have a document description, then we should use that, otherwise use the site's description
      @document.description or @site.description

    # Get the prepared site/document keywords
    getPreparedKeywords: ->
      # Merge the document keywords with the site keywords
      @site.keywords.concat(@document.keywords or []).join(', ')

  plugins:
    sass:
      sassPath: 'C:/Ruby187/bin/sass.bat'
      scssPath: 'C:/Ruby187/bin/scss.bat'
      compass: 'true'
      requireLibraries: ['susy']

  # Here we can define handlers for events that DocPad fires
  # You can find a full listing of events on the DocPad Wiki
  events:
    # Write After
    # Used to minify our assets with grunt
    writeAfter: (opts,next) ->
    # Prepare
      safeps = require('safeps')
      pathUtil = require('path')
      docpad = @docpad
      rootPath = docpad.getConfig().rootPath
      gruntPath = pathUtil.join(rootPath, 'node_modules', '.bin', 'grunt.cmd')

      # Perform the grunt `min` task
      # https://github.com/gruntjs/grunt/blob/0.3-stable/docs/task_min.md
      command = [gruntPath]

      # Execute
      safeps.spawn(command, {cwd:rootPath,output:true}, next)

      # Chain
      @
}

# Export the DocPad Configuration
module.exports = docpadConfig