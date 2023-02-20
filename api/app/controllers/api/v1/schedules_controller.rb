class Api::V1::SchedulesController < Api::V1::ApplicationController
    before_action :set_schedule, only:[:show, :update, :destroy]

    def index
        schedules = Schedule.all.order(created_at: :desc)
        render status: 200, json: schedules
    end

    def show
        render status: 200, json: @schedule
    end

    def create
        schedule = Schedule.create(schedule_params)
        if schedule
            render status: 201, json: schedule
        else
            render status: 400, json: {data: schedule.errors}
        end
    end

    def update
        if @schedule.update(schedule_params)
            render status: 200, json: @schedule
        else
            render status: 400, json: {data: @schedule.errors}
        end
    end

    def destroy
        if @schedule.destroy
            render status: 200, json: @schedule
        else
            render status: 400, json: {data: @schedule.errors}
        end
    end
    

    private

    def set_schedule
        @schedule = Schedule.find(params[:id])
    end

    def schedule_params
        params.require(:schedule).permit(:start_at, :end_at, :is_locked, :description, :user_id, :schedule_kind_id)
    end
end
