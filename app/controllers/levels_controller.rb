class LevelsController < ApplicationController
	before_action :set_level, only: [:show, :edit, :update, :destroy]
	before_action :only_creator, only: [:edit, :update, :destroy]

	# GET /levels
	# GET /levels.json
	def index
		@levels = Level.all
	end

	# GET /levels/1
	# GET /levels/1.json
	def show
		render layout: false
	end

	# GET /levels/new
	def new
		@level = Level.new
	end

	# GET /levels/1/edit
	def edit
		@inputs = @level.inputs
		@outputs = @level.outputs
		@pieces = @level.pieces.join(',')
	end

	# POST /levels
	# POST /levels.json
	def create
		@level = Level.new(level_params.merge(user_id: current_user.id))

		respond_to do |format|
			if @level.save
				format.html { redirect_to @level, notice: 'Level was successfully created.' }
				format.json { render :show, status: :created, location: @level }
			else
				format.html { render :new }
				format.json { render json: @level.errors, status: :unprocessable_entity }
			end
		end
	end

	# PATCH/PUT /levels/1
	# PATCH/PUT /levels/1.json
	def update
		respond_to do |format|
			if @level.update(level_params)
				format.html { redirect_to @level, notice: 'Level was successfully updated.' }
				format.json { render :show, status: :ok, location: @level }
			else
				format.html { render :edit }
				format.json { render json: @level.errors, status: :unprocessable_entity }
			end
		end
	end

	# DELETE /levels/1
	# DELETE /levels/1.json
	def destroy
		@level.destroy
		respond_to do |format|
			format.html { redirect_to levels_url, notice: 'Level was successfully destroyed.' }
			format.json { head :no_content }
		end
	end

	def ajax_input
		render "_input", layout: false
	end

	def ajax_output
		render "_output", layout: false
	end

	private

	def only_creator
		redirect_back fallback_location: levels_path, alert: "Only editable by the current user" if current_user != @level.user
	end

	# Use callbacks to share common setup or constraints between actions.
	def set_level
		@level = Level.find(params[:id])
	end

	# Never trust parameters from the scary internet, only allow the white list through.
	def level_params
		p = params.require(:level).permit(:user_id, :pieces, :width, :height, :name, :description, :inputs => [], :outputs => [])
		# p[:outputs] = p[:outputs].map { |a| a.split('') }
		# p[:inputs] = p[:inputs].map { |a| a.split('') }
		p[:pieces] = p[:pieces].split(',')
		# raise p.inspect
		p
	end
end
