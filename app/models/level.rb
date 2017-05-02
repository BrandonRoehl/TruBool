class Level < ApplicationRecord
	belongs_to :user
	validates :JSONinputs, :JSONoutputs, :JSONpieces, :width, :height, presence: true
	validates :width, :height, numericality: { only_integer: true, greater_than: 0 }
	[:inputs, :outputs, :pieces].each do |method|
		define_method method do
			if result = self.send("JSON#{method}")
				return JSON.parse(result)
			end
		end
		define_method "#{method}=" do |arg|
			raise "Wrong type" if !arg.kind_of? Array
			self.send("JSON#{method}=", arg.to_json)
		end
	end
end
