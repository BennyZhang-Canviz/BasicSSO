require 'fileutils'

module ApplicationHelper

  def full_host
    if request.scheme && request.url.match(URI::ABS_URI)
      uri = URI.parse(request.url.gsub(/\?.*$/, ''))
      uri.path = ''
      uri.scheme = 'https' if ssl?
      uri.to_s
      else ''
    end
  end

  def ssl?
    request.env['HTTP_X_ARR_SSL'] ||
      request.env['HTTPS'] == 'on' ||
      request.env['HTTP_X_FORWARDED_SSL'] == 'on' ||
      request.env['HTTP_X_FORWARDED_SCHEME'] == 'https' ||
      (request.env['HTTP_X_FORWARDED_PROTO'] && request.env['HTTP_X_FORWARDED_PROTO'].split(',')[0] == 'https') ||
      request.env['rack.url_scheme'] == 'https'
  end

end