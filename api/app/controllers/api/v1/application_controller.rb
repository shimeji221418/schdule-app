module Api
    class V1::ApplicationController < ActionController::API
      include Firebase::Auth::Authenticable
      before_action :authenticate_user

        private

        def check_admin
            admin_user = User.find(params[:user_id]) # 別の変数名を使用
            unless admin_user.admin?
                render status: 400, json: {data: "error"}
            end
        end
    end


    
end