class BrainsSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :brain_data, :brain_type
end
