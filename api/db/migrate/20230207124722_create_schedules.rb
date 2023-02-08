class CreateSchedules < ActiveRecord::Migration[7.0]
  def change
    create_table :schedules do |t|
      t.datetime :start_at
      t.datetime :end_at
      t.boolean :is_locked
      t.string :description
      t.references :user, null: false, foreign_key: true
      t.references :schedule_kind, null: false, foreign_key: true

      t.timestamps
    end
  end
end
