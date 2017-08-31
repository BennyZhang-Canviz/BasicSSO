require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)
module EDUGraphAPIRuby
  class Application < Rails::Application
    config.eager_load_paths += %W(#{config.root}/lib)
  end
end