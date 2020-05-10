class ChangeTypeName < ActiveRecord::Migration[6.0]
  def change
    rename_column :brains, :type, :brain_type
  end
end
