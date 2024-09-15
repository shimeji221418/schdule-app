FirebaseIdToken.configure do |config|
    config.redis = Redis.new
    config.project_ids = [ENV["FIREBASE_ID"]]
  end