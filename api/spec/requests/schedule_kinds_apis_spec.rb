require 'rails_helper'

RSpec.describe "ScheduleKindsApis", type: :request do
  let(:user) { FactoryBot.create(:user) }
  before { stub_firebase(user) }

  describe "GET /schedule_kinds_apis" do
    it "全てのタスクを取得する" do
      FactoryBot.create_list(:schedule_kind, 10)
      get "/api/v1/schedule_kinds", params: {user_id: user.id}
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json.length).to eq(10)
    end
  end

  describe "GET /schedule_kinds/:id" do
    it "特定のタスクを取得する" do
      schedule_kind = create(:schedule_kind)
      get "/api/v1/schedule_kinds/#{schedule_kind.id}", params: {user_id: user.id}
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json['name']).to eq(schedule_kind.name)
    end
  end

  describe "POST /schedule_kinds/" do
    before do
      @schedule_kind_crete_params = {
        name: "New Schedule_kind",
        color: "blue"
      }
    end
    it "新規作成" do
      expect{ post "/api/v1/schedule_kinds/", params: {schedule_kind: @schedule_kind_crete_params, user_id: user.id}}.to change(ScheduleKind, :count).by(+1)
      expect(response.status).to eq(201)
    end
  end

  describe "PUT /schedule_kinds/:id" do
    before do
      @schedule_kind_update_params = {
        name: "Update_schedule_kind",
        color: "green"
      }
    end
    it "特定のタスクを更新する" do
      schedule_kind = create(:schedule_kind)
      put "/api/v1/schedule_kinds/#{schedule_kind.id}", params: {schedule_kind: @schedule_kind_update_params, user_id: user.id }
      expect(response.status).to eq(200)
      expect(schedule_kind.reload.name).to eq(@schedule_kind_update_params[:name])
    end
  end

  describe "DELETE /schedule_kinds/:id" do
    it "特定のタスクを削除する" do
      schedule_kind = create(:schedule_kind)
      expect{ delete "/api/v1/schedule_kinds/#{schedule_kind.id}", params: {user_id: user.id}}.to change(ScheduleKind, :count).by(-1)
      expect(response.status).to eq(200)
    end
  end
end
