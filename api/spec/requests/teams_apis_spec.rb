require 'rails_helper'

RSpec.describe "TeamsApis", type: :request do
  let (:headers) {
    {
      'Content-Type': 'application/json',
      Authorization: "Bearer token"
    }
  }

  let(:user) { FactoryBot.create(:user) }
  before { stub_firebase(user) }

  describe "GET /teams_apis" do
    it '全てのチームを取得する' do
      FactoryBot.create_list(:team, 10)
      get '/api/v1/teams', params: {user_id: user.id}, headers: headers
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json.length).to eq(11)
    end
  end

  describe "GET /teams/:id" do
    it "特定のチームを取得する" do
      team = create(:team)
      get "/api/v1/teams/#{team.id}",  params: {user_id: user.id}
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json['name']).to eq(team.name)
    end
  end

  describe "POST /teams" do
    before do
      @team_create_params = "New Team"
    end
    it "新規作成" do
      expect { post '/api/v1/teams', params: {team: {name: @team_create_params}, user_id: user.id}}.to change(Team, :count).by(+1)
      expect(response.status).to eq(201)
    end
  end

  describe "PUT /teams/:id" do
    it "特定のチームを更新する" do
      team = create(:team)
      @team_update_params = "Update Team"
      put "/api/v1/teams/#{team.id}", params: {team: {name: @team_update_params}, user_id: user.id}
      expect(response.status).to eq(200)
      expect(team.reload.name).to eq(@team_update_params)
    end
  end

  describe "DELETE /teams/:id" do
    it "特定のチームを消去する" do
      team = create(:team)
      expect{ delete "/api/v1/teams/#{team.id}", params: {user_id: user.id}}.to change(Team, :count).by(-1)
      expect(response.status).to eq(200)
    end
  end

end
