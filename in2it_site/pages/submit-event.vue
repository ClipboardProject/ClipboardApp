<template>
    <div class="container">
        <v-col lg="8" offset-lg="2" md="12" offset-md="0" sm="12" cols="12">
            <v-row class="page-heading-row">
                <v-col>
                    <h1 class="post-event-heading">Post an Event</h1>
                </v-col>
            </v-row>

            <v-form
                ref="form"
                lazy-validation
            >
                <v-row>
                    <v-col cols="12">
                        <v-row>
                            <h2 class="post-event-subheading">General Info</h2>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-label>
                                    Organization
                                    <span class="required-star"> *</span>
                                </v-label>
                                <v-text-field
                                    v-model="event.organization"
                                    required
                                    outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-label>
                                    Event Title
                                    <span class="required-star"> *</span>
                                </v-label>
                                <v-text-field
                                    v-model="event.title"
                                    required
                                    outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-label>
                                    Description of Event
                                    <span class="required-star"> *</span>
                                </v-label>
                                <v-textarea
                                    v-model="event.description"
                                    required
                                    outlined
                                ></v-textarea>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-label>
                                    Event URL (Optional)
                                </v-label>
                                <v-text-field
                                    v-model="event.url"
                                    hint="Link to a specific event is preferred, but link to a page containing general event listings is okay"
                                    outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-label>
                                    Price
                                    <span class="required-star"> *</span>
                                </v-label>
                                <v-text-field
                                    v-model="event.price"
                                    prepend-inner-icon="mdi-currency-usd"
                                    outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <h2 class="post-event-subheading">Location</h2>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-checkbox
                                    v-model="isVirtualEvent"
                                    label="This is a virtual event"
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-row v-if="!isVirtualEvent">
                            <v-col>
                                <v-label>
                                    Event Address Line 1
                                    <span class="required-star"> *</span>
                                </v-label>
                                <v-text-field
                                    v-model="addressLine1"
                                    outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="!isVirtualEvent">
                            <v-col>
                                <v-label>Event Address Line 2 (Optional)</v-label>
                                <v-text-field
                                    v-model="addressLine2"
                                    outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <h2 class="post-event-subheading">Date & Time</h2>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-label>
                                    Event Start Date
                                    <span class="required-star"> *</span>
                                </v-label>
                                <v-menu
                                    ref="startDateMenu"
                                    v-model="isStartDatePickerOpen"
                                    :close-on-content-click="false"
                                    :return-value.sync="startDatePickerValue"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="startDatePickerValue"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            v-on="on"
                                            outlined
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="startDatePickerValue" no-title scrollable @change="setStartDate">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="isStartDatePickerOpen = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.startDateMenu.save(startDatePickerValue)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col v-if="event.isMultiDayEvent">
                                <v-label>Event End Date</v-label>
                                <v-menu
                                    ref="endDateMenu"
                                    v-model="isEndDatePickerOpen"
                                    :close-on-content-click="false"
                                    :return-value.sync="endDatePickerValue"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="290px"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            v-model="endDatePickerValue"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            v-on="on"
                                            outlined
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="endDatePickerValue" no-title scrollable @change="setEndDate">
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="isEndDatePickerOpen = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.endDateMenu.save(endDatePickerValue)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col>
                                <v-checkbox
                                    v-model="event.isMultiDayEvent"
                                    label="This is a multi day event"
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-row>
                                    <v-label>
                                        Start Time
                                        <span class="required-star"> *</span>
                                    </v-label>
                                </v-row>
                                <v-row>
                                    <v-col class="d-flex flex-row">
                                        <v-select
                                            :items="hourSelectionItems"
                                            v-model="startTimeHrs"
                                            outlined
                                        ></v-select>
                                        <v-select
                                            :items="minuteSelectionItems"
                                            v-model="startTimeMins"
                                            outlined
                                        ></v-select>
                                        <v-select
                                            :items="amPmSelectionItems"
                                            v-model="startTimeAmPm"
                                            outlined
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                            
                            <v-col>
                                <v-row>
                                    <v-label>
                                        End Time (Optional)
                                    </v-label>
                                </v-row>
                                <v-row>
                                    <v-col class="d-flex flex-row">
                                        <v-select
                                            :items="hourSelectionItems"
                                            v-model="endTimeHrs"
                                            outlined
                                        ></v-select>
                                        <v-select
                                            :items="minuteSelectionItems"
                                            v-model="endTimeMins"
                                            outlined
                                        ></v-select>
                                        <v-select
                                            :items="amPmSelectionItems"
                                            v-model="endTimeAmPm"
                                            outlined
                                        ></v-select>
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-checkbox
                                v-model="event.isRecurring"
                                label="This is a recurring event"
                                @change="setRecurringWeekdays"
                            ></v-checkbox>
                        </v-row>
                        <div v-if="event.isRecurring">
                            <v-row>
                                <v-col>
                                    <v-label>This event is held</v-label>
                                    <v-select :items="recurringTimeIntervals" v-model="event.recurringTimeInterval" outlined></v-select>
                                </v-col>
                            </v-row>
                            <v-row v-if="event.recurringTimeInterval == 'Weekly'">
                                <v-col>
                                    <v-row>
                                        <v-label v-if="event.weeklyRecurringDays.length">
                                            {{ weeklyRecurringDaysLabelText }}
                                        </v-label>
                                    </v-row>
                                    <v-row>
                                        <v-btn-toggle
                                            v-model="event.weeklyRecurringDays"
                                            tile
                                            background-color="primary"
                                            group
                                            multiple
                                        >
                                            <v-btn value="Sunday" class="weekday-button">
                                                Su
                                            </v-btn>

                                            <v-btn value="Monday">
                                                M
                                            </v-btn>

                                            <v-btn value="Tuesday">
                                                Tu
                                            </v-btn>

                                            <v-btn value="Wednesday">
                                                W
                                            </v-btn>

                                            <v-btn value="Thursday">
                                                Th
                                            </v-btn>

                                            <v-btn value="Friday">
                                                F
                                            </v-btn>

                                            <v-btn value="Saturday">
                                                Sa
                                            </v-btn>
                                        </v-btn-toggle>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row v-if="event.recurringTimeInterval == 'Monthly'">
                                <v-col>
                                    <v-radio-group v-model="isWeekOfMonth">
                                        <v-radio :label="recurringDayNumLabel" :value=false></v-radio>
                                        <v-radio :label="recurringNthDayLabel" :value=true></v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                        </div>
                        <v-row>
                            <h2 class="post-event-subheading">Accessibility</h2>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-label>
                                    Does this event have accommodations for people with disabilities?
                                    <span class="required-star"> *</span>
                                </v-label>
                                <v-radio-group v-model="event.handicapAccessible" row>
                                    <v-radio label="Yes" v-bind:value=true></v-radio>
                                    <v-radio label="No" v-bind:value=false></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-label>
                                    Will participants be required to perform any strenuous physical activities?
                                    <span class="required-star"> *</span>
                                </v-label>
                                <v-radio-group v-model="event.requiresPhysicalActivities" row>
                                    <v-radio label="Yes" v-bind:value=true></v-radio>
                                    <v-radio label="No" v-bind:value=false></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col>
                                <v-btn color="#173450" @click="submitEvent" dark large>Submit</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </v-col>
    </div>
</template>

<script>
    import axios from 'axios';
    import NeighborhoodAutocomplete from '~/components/NeighborhoodAutocomplete';
    import firebase from 'firebase/app'
    import 'firebase/auth'

    export default{
        data() {
			return {
                //event object properties are limited to only those accepted by the API
                //form-specific variables like the amPm values are stored outside the event object
                addressLine1: '',
                addressLine2: '',
                isStartDatePickerOpen: false,
                isEndDatePickerOpen: false,
                recurringTimeIntervals: ['Weekly', 'Monthly'],
                hourSelectionItems: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                minuteSelectionItems: ['00', '15', '30', '45'],
                amPmSelectionItems: ['AM', 'PM'],
                startDatePickerValue: '',
                endDatePickerValue: '',
                submissionCompleted: false,
                startDate: new Date(),
                endDate: new Date(),
                startTimeHrs: '9',
                startTimeMins: '00',
                startTimeAmPm: 'AM',
                endTimeHrs: '12',
                endTimeMins: '00',
                endTimeAmPm: 'PM',
                isWeekOfMonth: false,
                 isVirtualEvent: false,
				event: {
                    organization: '',
                    title: '',
                    description: '',
                    address: '',
                    neighborhood: '',
                    url: '',
                    price: '',
                    isMultiDayEvent: false,
                    startDateTime: '',
                    endDateTime: '',
                    isRecurring: false,
                    mode: '',
                    recurringTimeInterval: '',
                    weeklyRecurringDays: [],
                    monthlyRecurringValue: '',
                    handicapAccessible: false,
                    requiresPhysicalActivities: false
                }
			};
        },
        computed: {
            address: function () {
                return this.addressLine1 + ' ' + this.addressLine2;
            },
            startDateTime: function () {
                return new Date(
                    this.startDate.getFullYear(), 
                    this.startDate.getMonth(), 
                    this.startDate.getDate(),
                    this.getStartHourInt(),
                    parseInt(this.startTimeMins)
                );
            },
            endDateTime: function () {
                let endHourInt = this.getEndHourInt();
                if (!this.event.isMultiDayEvent) {
                    //Event ends on same day as start + 3 hours
                    this.endDate = this.startDate;
                    //endHourInt = this.getStartHourInt() + 3;
                }

                return new Date(
                    this.endDate.getFullYear(), 
                    this.endDate.getMonth(), 
                    this.endDate.getDate(),
                    endHourInt,
                    parseInt(this.endTimeMins)
                );
            },
            mode: function() {
                if (this.event.recurringTimeInterval === 'Weekly') {
                    return 'week';
                }
                else if (this.event.recurringTimeInterval === 'Monthly' && this.isWeekOfMonth) {
                    return 'weekOfMonth';
                }
                else {
                    return 'dayOfMonth';
                }
            },
            recurringDayNumLabel: function () {
                return 'The ' + this.getOrdinalSuffix(this.startDate.getDate()) + ' of every month';
            },
            recurringDayNumValue: function () {
                return this.getOrdinalSuffix(this.startDate.getDate());
            },
            recurringNthDayLabel: function () {
                const nth = this.getRecurringNthDay();
                return this.getOrdinalSuffix(nth) + ' ' + this.getDayName(this.startDate) + ' of every month';
            },
            recurringNthDayValue: function () {
                return this.getRecurringNthDay();
            },
            weeklyRecurringDaysLabelText: function () {
                if (this.event.weeklyRecurringDays.length <= 0) {
                    return '';
                }
                else if (this.event.weeklyRecurringDays.length == 1) {
                    return 'Every ' + this.event.weeklyRecurringDays[0];
                }
                else if (this.event.weeklyRecurringDays.length == 2) {
                    return 'Every ' + this.event.weeklyRecurringDays[0] + ' and ' + this.event.weeklyRecurringDays[1];
                }
                else {
                    let text = 'Every ';
                    for (let i in this.event.weeklyRecurringDays) {
                        if (i < this.event.weeklyRecurringDays.length - 1) {
                            text += this.event.weeklyRecurringDays[i] + ', ';
                        }
                        else { //Use 'and' instead of comma on last day
                            text += 'and ' + this.event.weeklyRecurringDays[i];
                        }
                    }
                    return text;
                }
            },
            submitUrl: function() {
				const eventURL = process.server ? 'http://event_service:5000' : this.$env.IN2IT_API_URL;
				return `${eventURL}/events${this.event.isRecurring ? '/recurringEvent' : ''}`;
			},
        },
        methods: {
            getDateObjectFromYYYYMMDD: function (YYYYMMDD) {
                let datePieces = YYYYMMDD.split('-');
                return new Date(datePieces[0], (datePieces[1] - 1), datePieces[2]);
            },
            setStartDate: function (YYYYMMDD) {
                this.startDate = this.getDateObjectFromYYYYMMDD(YYYYMMDD);
                this.startDatePickerValue = YYYYMMDD;
            },
            setEndDate: function (YYYYMMDD) {
                this.endDate = this.getDateObjectFromYYYYMMDD(YYYYMMDD);
                this.endDatePickerValue = YYYYMMDD;
            },
            setRecurringWeekdays: function () {
                if (this.event.isRecurring) {
                    this.event.weeklyRecurringDays = [this.getDayName(this.startDate)];
                }
                else {
                    this.event.recurringTimeInterval = '';
                    this.event.weeklyRecurringDays = [];
                }
            },
            getStartHourInt: function () {
                return this.get24HourInt(this.startTimeHrs, this.startTimeAmPm);
            },
            getEndHourInt: function () {
                return this.get24HourInt(this.endTimeHrs, this.endTimeAmPm);
            },
            get24HourInt: function (time12HourString, amPmString) {
                let hourInt = parseInt(time12HourString);
                if (amPmString == 'PM' && hourInt != 12) {
                    hourInt += 12;
                }
                return hourInt;
            },
            submitEvent: async function () {
                this.prepareEventPayload();
                console.log(this.event);
                
                const auth = await firebase.auth();
                if (!auth.currentUser) {
                    // Not logged in
                    return;
                }
                const token = await auth.currentUser.getIdToken();
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                axios.post(this.submitUrl, this.event, config)
                .then((res) => {
                    this.submissionCompleted = true;
                    alert('Success');
                })
                .catch((err) => {
                    alert(err);
                });
            },
            prepareEventPayload: function () {
                if (this.isVirtualEvent) {
                    this.event.address = '';
                }
                else if (this.address.trim()  === '') {
                    // address not supplied, send null to get a validation error from the api
                    this.event.address = null;
                }
                else {
                    this.event.address = this.address;
                }

                this.event.eventTime = {
                    startTimestamp: this.startDateTime.toLocaleString(),
                    endTimestamp: this.endDateTime.toLocaleString()
                };
                this.event.mode = this.mode;
                if (this.mode === 'weekOfMonth') {
                    this.event.monthlyRecurringWeekday = this.getDayName(this.startDate);
                    this.event.monthlyRecurringWeekNumber = this.getRecurringNthDay();
                }
                else if (this.mode === 'dayOfMonth') {
                    this.event.monthlyRecurringDay = this.startDate.getDate();
                }

            },
            getOrdinalSuffix: function (i) {
                let j = i % 10,
                    k = i % 100;
                if (j == 1 && k != 11) {
                    return i + "st";
                }
                if (j == 2 && k != 12) {
                    return i + "nd";
                }
                if (j == 3 && k != 13) {
                    return i + "rd";
                }
                return i + "th";
            },
            getDayName: function (dateObject) {
                return dateObject.toLocaleDateString('en-US', { weekday: 'long'});
            },
            getRecurringNthDay: function() {
                let nth = 0;
                let eventDayNum = this.startDate.getDate();
                let eventMonth = this.startDate.getMonth();
                let eventDayName = this.getDayName(this.startDate);

                for (let i = 0; i < eventDayNum; ++i) {
                    //Start at first date of current month
                    let testDateString = this.startDate.getFullYear() + '-' + (eventMonth + 1) + '-1';
                    let testDate = this.getDateObjectFromYYYYMMDD(testDateString);

                    //Iterate through days of month
                    testDate.setDate(testDate.getDate() + i);

                    if (testDate.getMonth() != eventMonth) break; //Reached end of month
                    if (this.getDayName(testDate) == eventDayName) { //Day name matches
                        ++nth;
                    }
                }
                return nth;
            }
        },
        components: {
            NeighborhoodAutocomplete
        },
        created() {
            firebase.auth().onAuthStateChanged(user => {
                if (!user) {
                    this.$router.push('/login');
                }
            });
        },
    };
</script>

<style scoped>
    .page-heading-row {
        background-color: #173450;
    }

    .post-event-heading {
        color: #fff;
        font-size: 48px;
        margin-bottom: 0px;
    }

    .post-event-subheading {
        margin-top: 20px;
        font-weight: bold;
        font-size: 26px;
        color: rgba(0, 0, 0, 0.7);
    }

    .v-label {
        font-size: 16px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.6);
    }

    .v-input {
        border-radius: 0px;
    }

    .required-star {
        color: #c51313;
    }

    .weekday-button{
        border: 1px solid;
        border-color: #000;
    }
</style>