<template>
	<main class="site_main">
		<div class="page_contents container">
			<div class="w_box light">
			<div class="fx fx-jb fx-ar wp100"><!-- 위로 맞추려면 fx-ar 대신 fx-as -->
				<div id="calendar" class="wc_box">
					<div class="datemove">
						<a href="javascript:;" @click="onClickPrev(currentMonth)"><span class="mi">arrow_back_ios</span></a>
						<h2>{{ currentYear }} . {{ currentMonth }}</h2>
						<a href="javascript:;" @click="onClickNext(currentMonth)"><span class="mi">arrow_forward_ios</span></a>
					</div>
				<div class="table_top">
					<div id="tabs" class="tab_box">
						<a href="javascript:;" class="btn_tab active">내가등록한현황</a>
					</div>
				</div>
				<table>
					<thead>
						<tr>
							<th scope="col">일</th>
							<th scope="col">월</th>
							<th scope="col">화</th>
							<th scope="col">수</th>
							<th scope="col">목</th>
							<th scope="col">금</th>
							<th scope="col">토</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(row, index) in currentCalendarMatrix" :key="index">
							<td v-for="(day, index2) in row" :key="index2" :class="isToday(currentYear, currentMonth, day) == true ? 'today':''">
								<p class="title_day" v-if="isToday(currentYear, currentMonth, day)">
									<a href="" @click.prevent="fnCalendar(day)">
										<strong class="day">{{ day }}</strong>
									</a>
								</p>
								<p class="title_day" v-else>
									<a href="" @click.prevent="fnCalendar(day)">
										<strong v-if="index2 == 0" class="day" style="color: #e91b1b;">{{ day }}</strong>
										<strong v-else class="day">{{ day }}</strong>
									</a>
								</p>
								<div v-for=" (item, list2_ind) in list2.filter((i)=>i.date_ary_row==day)" :key="item" :value="item.uid">
									<template v-if="list2_ind == 0 && item.position > 1">
										<p class="empty" v-for="row in (item.position)-1" :key="row" id="1"><a class="subj"><span>&nbsp;</span></a></p>
									</template>
									<template v-else-if="(item.position - item.lag_position - 1) > 0">
										<p class="empty" v-for="row in (item.position - item.lag_position - 1)" :key="row" id="2"><a class="subj"><span>&nbsp;</span></a></p>
									</template>

									<p v-if="item.arry_length > 1 && item.end_date_day != day && item.start_date_day != day" class="range">
										<a href="javascript:;" class="subj"
											@click.prevent="fnCalendarinfo(item.uid)">
											<span :class="'cat'+item.type_num">&nbsp;</span>
										</a>
									</p>
									<p v-else-if="item.arry_length > 1 && item.end_date_day != day && item.start_date_day == day" class="first">
										<a href="javascript:;" class="subj"
											@click.prevent="fnCalendarinfo(item.uid)">
											<span :class="'cat'+item.type_num">{{ item.type}}</span>
										</a>
									</p>
									<p v-else-if="item.arry_length == 1" class="">
										<a href="javascript:;" class="subj"
											@click.prevent="fnCalendarinfo(item.uid)">
											<span :class="'cat'+item.type_num">{{ item.type }}</span>
											<span class="title">{{ item.title }}</span>
										</a>
									</p>
									<p v-else-if="item.arry_length > 1" class="last">
										<a href="javascript:;" class="subj" @click.prevent="fnCalendarinfo(item.uid)">
											<span :class="'cat'+item.type_num">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
											<span class="title">{{ item.title }}</span>
										</a>
									</p>
									
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div><!-- calendar -->

			<div class="s_board">
				<div class="wc_box">
					<h1>최근일정</h1>
					<div class="scroll_box">
						<li v-for="item in schelist" :key="item">
							<div class="fx fx-as">
								<div v-if="item.start_date == schedule.current">
									<p class="day">{{ item.today_date+'('+item.today+')' }}</p>
									<p class="st today">오늘</p>
								</div>
								<div v-if="item.end_date == schedule.current">
									<p class="day">{{ item.today_date+'('+item.today+')' }}</p>
									<p class="st today">오늘</p>
								</div>
								<div v-else>
									<p class="day">{{ item.tomorrow_date+'('+item.tomorrow+')' }}</p>
									<p class="st tomorrow">내일</p>
								</div>
								<div class="fx1"> 
									<div class="fx fx-as"> 
										<span :class="['cat'+item.type_num, 'type']">{{ item.type }}</span>
										<span class="title">{{ item.title }}</span>
									</div>
									<p class="date">
										<label>일정</label>
										<span v-if="item.start_date != item.end_date" >{{ item.start_date+'~'+item.end_date }}</span>
										<span v-else >{{ item.start_date }}</span>
									</p>
									<p class="cont">{{ item.contents }}</p>
								</div>
							</div>
						</li>
						<ui v-if="schelist == [] || schelist == ''">
							<li style="text-align: center;padding: 30px;font-size: 14px;">최근 일정이 없습니다.</li>
						</ui>
					</div>
						</div>
					</div><!-- } s_board -->
				</div>
			</div><!-- } w_box -->
		</div>
		<schepopup ref="schepopup" v-if="Modal==true"></schepopup>
		<scheinfopopup ref="scheinfopopup" v-if="Modal2==true"></scheinfopopup>
	</main>
</template>

<script>
    import "es6-promise/auto";
    import Vue from "vue";
    import Axios from "axios";
	import schepopup from "../popup/schedule_popup.vue";
	import scheinfopopup from "../popup/schedule_info_popup.vue";
	Vue.component('schepopup',schepopup);
	Vue.component('scheinfopopup',scheinfopopup);
    
    export default {
      data: function() {
        return {
			date_day:[],
			start_date_day:[],
			end_date_day:[],
			list:{},
			list2:[],
			schelist:[],
			Modal:false,
			Modal2:false,
			rootYear: 2000,
			rootDayOfWeekIndex: 6, //이유는 모르겠고 6으로 해야함 
			currentYear: new Date().getFullYear(),
			currentMonth: new Date().getMonth()+1,
			currentDay: new Date().getDate(),
			currentMonthStartWeekIndex: null,
			currentCalendarMatrix: [],
			endOfDay: null,
			memoDatas: [],
			schedule:{
				type:"",
				title:"",
				contents:"",
				start_date:"",
				end_date:"",
				today:"",
				tomorrow:"",
				today_date:"",
				tomorrow_date:"",
				current:"",
			},
			empty:'',
		};
      },
      mounted: function() {
		this.init();
		this.fnselectSchedule();
	  },
      methods: {
		init:function(){
			this.currentMonthStartWeekIndex = this.getStartWeek(this.currentYear, this.currentMonth);
			this.endOfDay = this.getEndOfDay(this.currentYear, this.currentMonth);
			this.initCalendar();
			this.selectSchedule();
		},
		initCalendar:function(){
			this.currentCalendarMatrix = [];
			let day=1;
			
			for(let i=0; i<6; i++){
				let calendarRow = [];
				for(let j=0; j<7; j++){
					if(i==0 && j<this.currentMonthStartWeekIndex){
						calendarRow.push("");
					}
					else if(day<=this.endOfDay){
						calendarRow.push(day);
						day++;
					}
					else{
						calendarRow.push("");
					}
				}
				this.currentCalendarMatrix.push(calendarRow);
			}
		},
		getEndOfDay: function(year, month){
			switch(month){
				case 1:
				case 3:
				case 5:
				case 7:
				case 8:
				case 10:
				case 12:
					return 31;
					break;
				case 4:
				case 6:
				case 9:
				case 11:
					return 30;
					break;
				case 2:
					if( (year%4 == 0) && (year%100 != 0) || (year%400 == 0) ){
					return 29;   
					}
					else{
						return 28;
					}
					break;
				default:
					console.log("unknown month " + month);
					return 0;
					break;
			}
		},
		getStartWeek: function(targetYear, targetMonth){
			let year = this.rootYear;
			let month = 1;
			let sumOfDay = this.rootDayOfWeekIndex;
			while(true){
			if(targetYear > year){
				for(let i=0; i<12; i++){
					sumOfDay += this.getEndOfDay(year, month+i);
				}
				year++;
			}
			else if(targetYear == year){
				if(targetMonth > month){
					sumOfDay += this.getEndOfDay(year, month);
					month++;
				}
				else if(targetMonth == month){
					return (sumOfDay)%7;
				}
			}
			}
		},
		onClickPrev: function(month){
			month--;
			if(month<=0){
			this.currentMonth = 12;
			this.currentYear -= 1;
			}
			else{
			this.currentMonth -= 1;
			}
			this.init();
		},
		onClickNext: function(month){
			month++;
			if(month>12){
			this.currentMonth = 1;
			this.currentYear += 1;
			}
			else{
			this.currentMonth += 1;
			}
			this.init();
		},
		isToday: function(year, month, day){
			let date = new Date();
			return year == date.getFullYear() && month == date.getMonth()+1 && day == date.getDate(); 
		},
		fnCalendar:function(date,uid){
			var mon = "";
			var day = "";
			if(this.currentMonth.toString().length == 1){
				mon = '0'+this.currentMonth.toString();
			}else{
				mon = this.currentMonth.toString();
			}
			if(date.toString().length == 1){
				day = '0'+date.toString();
			}else{
				day = date.toString();
			}
			let selectdate = this.currentYear +'-'+ mon +'-'+ day;
			
			this.Modal = true;
			this.Modal2 = false;
            this.$nextTick(function() {
                if(this.Modal) {
				    this.$refs.schepopup.fnInit(selectdate,uid);
			    }
			})
		},
		fnCalendarinfo:function(uid){
			this.Modal2 = true;
			this.Modal = false;
			
            this.$nextTick(function() {
                if(this.Modal2) {
				    this.$refs.scheinfopopup.fnInit(uid);
			    }
			})

		},
		selectSchedule:function(){
			let vm = this;
			let mon = "";
			if(this.currentMonth.toString().length == 1){
				mon = '0'+this.currentMonth.toString();
			}else{
				mon = this.currentMonth.toString();
			}

			let send={
				mapperId : ['workplace.selectSchedule','workplace.selectSchedule_cnt'] ,
				selectDate: this.currentYear +'-'+ mon,
			}
			
			Axios.post("/multiList", send).then(function(response) {
                vm.list = response.data.list1;
				vm.list2 = response.data.list2;
			}).then(function(){
				vm.list2.sort(function(a,b){
					if(a.date_ary_row - b.date_ary_row == 0){
						return a.cnt_max - b.cnt_max
					}
      			});
			});
		},
		fnselectSchedule:function(){
			let vm = this;
			
			let send={
				mapperId : 'workplace.selectSchedulelist' ,
			}
			var mon = "";
			var day = "";
			if(vm.currentMonth.toString().length == 1){
				mon = '0'+this.currentMonth.toString();
			}else{
				mon = this.currentMonth.toString();
			}
			if(vm.currentDay.toString().length == 1){
				day = '0'+vm.currentDay.toString();
			}else{
				day = vm.currentDay.toString();
			}

			vm.schedule.current = vm.currentYear+'-'+mon+'-'+day;
			
			


			Axios.post("/list", send).then(function(response) {
                vm.schelist = response.data.list;
				if(vm.schelist.length != 0){
					vm.schedule.title = vm.schelist[0].title;
					vm.schedule.contents = vm.schelist[0].contents;
					vm.schedule.start_date = vm.schelist[0].start_date;
					vm.schedule.end_date = vm.schelist[0].end_date;
					vm.schedule.today = vm.schelist[0].today;
					vm.schedule.tomorrow = vm.schelist[0].tomorrow;
					vm.schedule.today_date = parseInt(vm.schelist[0].today_date);
					vm.schedule.tomorrow_date = vm.schelist[0].tomorrow_date;
				}else{
					console.log("일정 없음");
				}
				// console.log(vm.schedule.today_date);
				// if(vm.currentDay == vm.schedule.today_date){
				// 	vm.schedule.current = "오늘";
				// }else{
				// 	vm.schedule.current = "내일";
				// }
				

			});

		}
	
	  }
    };
</script>
