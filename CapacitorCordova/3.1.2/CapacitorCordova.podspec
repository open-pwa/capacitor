pod_version = '3.1.2'
version_commit = 'd6a2f03c'

Pod::Spec.new do |s|
  s.name         = "CapacitorCordova"
  s.module_name  = 'Cordova'
  s.version      = pod_version.to_s
  s.summary      = 'Capacitor Cordova Compatibility Layer'
  s.homepage     = 'https://capacitorjs.com'
  s.license      = 'Commercial'
  s.authors      = { 'Ionic Team' => 'hi@ionicframework.com' }
  s.source       = { :git => 'https://github.com/ionic-team/capacitor.git', :commit => version_commit.to_s }
  s.platform     = :ios, 12.0
  s.source_files = 'ios/CapacitorCordova/CapacitorCordova/**/*.{h,m}'
  s.public_header_files = 'ios/CapacitorCordova/CapacitorCordova/Classes/Public/*.h', 'ios/CapacitorCordova/CapacitorCordova/CapacitorCordova.h'
  s.module_map = 'ios/CapacitorCordova/CapacitorCordova/CapacitorCordova.modulemap'
  s.requires_arc = true
  s.framework    = 'WebKit'
end
