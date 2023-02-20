require 'rails_helper'

RSpec.describe "SchedulesApis", type: :request do
  let(:user) { FactoryBot.create(:user) }
  before { stub_firebase(user) }

  describe "GET /schedules_apis" do
    it "全ての予定を取得する" do
      FactoryBot.create_list(:schedule, 10)
      get '/api/v1/schedules/'
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json.length).to eq(10)
    end
  end

  describe "GET /schedules/:id" do
    it "特定の予定を取得する" do
      schedule = create(:schedule)
      get "/api/v1/schedules/#{schedule.id}"
      json = JSON.parse(response.body)
      expect(response.status).to eq(200)
      expect(json['description']).to eq(schedule.description)
    end
  end

  describe "POST /schedules" do
    before do
      schedule_kind = create(:schedule_kind)
      @schedule_create_params = {
        start_at:  '2023-2-20 11:00'.in_time_zone ,
        end_at:  '2023-2-20 12:00'.in_time_zone ,
        is_locked: true ,
        description: 'sales',
        user_id: user.id,
        schedule_kind_id: schedule_kind.id
      }

    end
    it "新規作成" do
      expect { post "/api/v1/schedules", params: {schedule: @schedule_create_params}}.to change(Schedule, :count).by(+1)
      expect(response.status).to eq(201)
    end
  end

  describe "PUT /schedules/:id" do
    it "特定の予定を更新する" do
      schedule = create(:schedule)
      @schedule_update_params = {
        start_at: '2023-2-20 10:00'.in_time_zone
      }
      put "/api/v1/schedules/#{schedule.id}" , params: {schedule: @schedule_update_params}
      expect(response.status).to eq(200)
      expect(schedule.reload.start_at).to eq(@schedule_update_params[:start_at])
    end
  end

  describe "DELETE /schedules/:id" do
    it "特定の予定を削除する" do
      schedule = create(:schedule)
      expect {delete "/api/v1/schedules/#{schedule.id}"}.to change(Schedule, :count).by(-1)
      expect(response.status).to eq(200)
    end
  end
end
