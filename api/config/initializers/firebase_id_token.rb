FirebaseIdToken.configure do |config|
    config.redis = Redis.new
    config.project_ids = ['schedule-app-dfa57']
  end