require 'rails_helper'

RSpec.describe "UsersApis", type: :request do
  let(:user) { FactoryBot.create(:user) }
  before { stub_firebase(user) }

  describe "GET /users_apis" do
    it "全てのUserを取得する" do
      FactoryBot.create_list(:user, 10)
      get '/api/v1/users', params: {user_id: user.id}
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json.length).to eq(11)
    end
  end

  describe "GET /users/:id" do
    it "特定のUserを取得する" do
      get "/api/v1/users/#{user.id}", params: {user_id: user.id}
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json['name']).to eq(user.name)
    end
  end

  describe "PUT /users/:id" do
    it "特定のUserを更新する" do
      put "/api/v1/users/#{user.id}", params: {user: {name: "yamaguti"}, user_id: user.id}
      expect(response.status).to eq(200)
      expect(user.reload.name).to eq("yamaguti")
    end
  end

  describe "DELETE /users/:id" do
    it "特定のUserを削除する" do
      expect{ delete "/api/v1/users/#{user.id}", params: {user_id: user.id}}.to change(User, :count).by(-1)
      expect(response.status).to eq(200)
    end
  end

  describe "GET /users/current" do
    it "ログインUserを取得する" do
      get '/api/v1/users/current', params: {uid: user.uid, user_id: user.id}
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json['name']).to eq(user.name)
    end
  end

  describe "GET /users/team_users" do
    it "同じチームUserを取得する" do
      get '/api/v1/users/team_users', params: {team_id: user.team_id, user_id: user.id}
      expect(response.status).to eq(200)
    end
  end
end
