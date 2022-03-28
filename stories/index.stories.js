import React from 'react';

import Calendar from '../src/index';
import myTheme from './myTheme';

const today = new Date();
const getDate = (type, start, value, operator) => {
  start = new Date(start);
  type = type.charAt(0).toUpperCase() + type.slice(1);

  if (operator === '+') {
    start[`set${type}`](start[`get${type}`]() + value);
  } else {
    start[`set${type}`](start[`get${type}`]() - value);
  }

  return start;
};

const viewModeOptions = [
  {
    title: 'Monthly',
    value: 'month'
  },
  {
    title: 'Weekly',
    value: 'week'
  },
  {
    title: 'Daily',
    value: 'day'
  }
];

class ClassComponent extends React.Component {
  ref = React.createRef();

  calendarInst = null;

  state = {
    dateRange: '',
    view: 'week'
  };

  componentDidMount() {
    this.calendarInst = this.ref.current.getInstance();
    this.setState({view: this.props.view});

    this.setRenderRangeText();
  }

  onAfterRenderSchedule(res) {
    console.group('onAfterRenderSchedule');
    console.log('Schedule Info : ', res.schedule);
    console.groupEnd();
  }

  onBeforeDeleteSchedule(res) {
    console.group('onBeforeDeleteSchedule');
    console.log('Schedule Info : ', res.schedule);
    console.groupEnd();

    const {id, calendarId} = res.schedule;

    this.calendarInst.deleteSchedule(id, calendarId);
  }

  onChangeSelect(ev) {
    this.setState({view: ev.target.value});

    this.setRenderRangeText();
  }

  onClickDayname(res) {
    // view : week, day
    console.group('onClickDayname');
    console.log(res.date);
    console.groupEnd();
  }

  onClickNavi(event) {
    if (event.target.tagName === 'BUTTON') {
      const {target} = event;
      let action = target.dataset ? target.dataset.action : target.getAttribute('data-action');
      action = action.replace('move-', '');

      this.calendarInst[action]();
      this.setRenderRangeText();
    }
  }

  onClickSchedule(res) {
    console.group('onClickSchedule');
    console.log('MouseEvent : ', res.event);
    console.log('Calendar Info : ', res.calendar);
    console.log('Schedule Info : ', res.schedule);
    console.groupEnd();
  }

  onClickTimezonesCollapseBtn(timezonesCollapsed) {
    // view : week, day
    console.group('onClickTimezonesCollapseBtn');
    console.log('Is Collapsed Timezone? ', timezonesCollapsed);
    console.groupEnd();

    const theme = {
      'week.daygridLeft.width': '100px',
      'week.timegridLeft.width': '100px'
    };

    this.calendarInst.setTheme(theme);
  }

  setRenderRangeText() {
    const view = this.calendarInst.getViewName();
    const calDate = this.calendarInst.getDate();
    const rangeStart = this.calendarInst.getDateRangeStart();
    const rangeEnd = this.calendarInst.getDateRangeEnd();
    let year = calDate.getFullYear();
    let month = calDate.getMonth() + 1;
    let date = calDate.getDate();
    let dateRangeText = '';
    let endMonth, endDate, start, end;

    switch (view) {
      case 'month':
        dateRangeText = `${year}-${month}`;
        break;
      case 'week':
        year = rangeStart.getFullYear();
        month = rangeStart.getMonth() + 1;
        date = rangeStart.getDate();
        endMonth = rangeEnd.getMonth() + 1;
        endDate = rangeEnd.getDate();

        start = `${year}-${month < 10 ? '0' : ''}${month}-${date < 10 ? '0' : ''}${date}`;
        end = `${year}-${endMonth < 10 ? '0' : ''}${endMonth}-${endDate < 10 ? '0' : ''}${endDate}`;
        dateRangeText = `${start} ~ ${end}`;
        break;
      default:
        dateRangeText = `${year}-${month}-${date}`;
    }

    this.setState({dateRange: dateRangeText});
  }

  onBeforeUpdateSchedule(updateData) {
    console.group('onBeforeUpdateSchedule');
    console.log(updateData);
    console.groupEnd();
    const targetSchedule = updateData.schedule;
    const changes = {
      start: updateData.start,
      end: updateData.end,
      ...(updateData.changes || {})
    };

    this.calendarInst.updateSchedule(targetSchedule.id, targetSchedule.calendarId, changes);
  }

  onBeforeCreateSchedule(scheduleData) {
    const schedule = {
      calendarId: scheduleData.calendarId || '',
      id: String(Math.random()),
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: scheduleData.start,
      end: scheduleData.end,
      category: scheduleData.isAllDay ? 'allday' : 'time',
      dueDateClass: '',
      location: scheduleData.location,
      state: scheduleData.state,
      isPrivate: scheduleData.isPrivate
    };

    this.calendarInst.createSchedules([schedule]);
  }

  render() {
    const {dateRange, view} = this.state;
    const selectedView = view || this.props.view;

    return (
      <div>
        <h1>🍞📅 TOAST UI Calendar + React.js</h1>
        <div>
          <select onChange={this.onChangeSelect.bind(this)} value={view}>
            {viewModeOptions.map((option, index) => (
              <option value={option.value} key={index}>
                {option.title}
              </option>
            ))}
          </select>
          <span>
            <button
              type="button"
              className="btn btn-default btn-sm move-today"
              data-action="move-today"
              onClick={this.onClickNavi.bind(this)}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-default btn-sm move-day"
              data-action="move-prev"
              onClick={this.onClickNavi.bind(this)}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn btn-default btn-sm move-day"
              data-action="move-next"
              onClick={this.onClickNavi.bind(this)}
            >
              Next
            </button>
          </span>
          <span className="render-range">{dateRange}</span>
        </div>
        <Calendar
          usageStatistics={false}
          calendars={[
            {
              id: '0',
              name: 'Private',
              bgColor: '#9e5fff',
              dragBgColor: '#9e5fff',
              borderColor: '#9e5fff'
            },
            {
              id: '1',
              name: 'Company',
              bgColor: '#00a9ff',
              dragBgColor: '#00a9ff',
              borderColor: '#00a9ff'
            }
          ]}
          defaultView="month"
          disableDblClick={true}
          height="900px"
          isReadOnly={false}
          month={{
            startDayOfWeek: 0
          }}
          schedules={[
            {
              id: '1',
              calendarId: '0',
              title: 'TOAST UI Calendar Study',
              category: 'time',
              dueDateClass: '',
              start: today.toISOString(),
              end: getDate('hours', today, 3, '+').toISOString()
            },
            {
              id: '2',
              calendarId: '0',
              title: 'Practice',
              category: 'milestone',
              dueDateClass: '',
              start: getDate('date', today, 1, '+').toISOString(),
              end: getDate('date', today, 1, '+').toISOString(),
              isReadOnly: true
            },
            {
              id: '3',
              calendarId: '0',
              title: 'FE Workshop',
              category: 'allday',
              dueDateClass: '',
              start: getDate('date', today, 2, '-').toISOString(),
              end: getDate('date', today, 1, '-').toISOString(),
              isReadOnly: true
            },
            {
              id: '4',
              calendarId: '0',
              title: 'Report',
              category: 'time',
              dueDateClass: '',
              start: today.toISOString(),
              end: getDate('hours', today, 1, '+').toISOString()
            }
          ]}
          scheduleView
          taskView
          template={{
            milestone(schedule) {
              return `<span style="color:#fff;background-color: ${schedule.bgColor};">${
                schedule.title
              }</span>`;
            },
            milestoneTitle() {
              return 'Milestone';
            },
            allday(schedule) {
              return `${schedule.title}<i class="fa fa-refresh"></i>`;
            },
            alldayTitle() {
              return 'All Day';
            }
          }}
          theme={myTheme}
          timezones={[
            {
              timezoneOffset: 540,
              displayLabel: 'GMT+09:00',
              tooltip: 'Seoul'
            },
            {
              timezoneOffset: -420,
              displayLabel: 'GMT-08:00',
              tooltip: 'Los Angeles'
            }
          ]}
          useDetailPopup
          useCreationPopup
          view={selectedView}
          week={{
            showTimezoneCollapseButton: true,
            timezonesCollapsed: false
          }}
          ref={this.ref}
          onAfterRenderSchedule={this.onAfterRenderSchedule.bind(this)}
          onBeforeDeleteSchedule={this.onBeforeDeleteSchedule.bind(this)}
          onClickDayname={this.onClickDayname.bind(this)}
          onClickSchedule={this.onClickSchedule.bind(this)}
          onClickTimezonesCollapseBtn={this.onClickTimezonesCollapseBtn.bind(this)}
          onBeforeUpdateSchedule={this.onBeforeUpdateSchedule.bind(this)}
          onBeforeCreateSchedule={this.onBeforeCreateSchedule.bind(this)}
        />
      </div>
    );
  }
}

// eslint-disable-next-line require-jsdoc
function FunctionComponent({view}) {
  const calendarRef = React.useRef();
  const [selectedDateRangeText, setSelectedDateRangeText] = React.useState('');
  const [selectedView, setSelectedView] = React.useState(view);
  const initialCalendars = [
    {
      id: '0',
      name: 'Private',
      bgColor: '#9e5fff',
      borderColor: '#9e5fff',
      dragBgColor: '#9e5fff'
    },
    {
      id: '1',
      name: 'Company',
      bgColor: '#00a9ff',
      borderColor: '#00a9ff',
      dragBgColor: '#00a9ff'
    }
  ];
  const initialSchedules = [
    {
      id: '1',
      calendarId: '0',
      title: 'TOAST UI Calendar Study',
      category: 'time',
      dueDateClass: '',
      start: today.toISOString(),
      end: getDate('hours', today, 3, '+').toISOString()
    },
    {
      id: '2',
      calendarId: '0',
      title: 'Practice',
      category: 'milestone',
      dueDateClass: '',
      start: getDate('date', today, 1, '+').toISOString(),
      end: getDate('date', today, 1, '+').toISOString(),
      isReadOnly: true
    },
    {
      id: '3',
      calendarId: '0',
      title: 'FE Workshop',
      category: 'allday',
      dueDateClass: '',
      start: getDate('date', today, 2, '-').toISOString(),
      end: getDate('date', today, 1, '-').toISOString(),
      isReadOnly: true
    },
    {
      id: '4',
      calendarId: '0',
      title: 'Report',
      category: 'time',
      dueDateClass: '',
      start: today.toISOString(),
      end: getDate('hours', today, 1, '+').toISOString()
    }
  ];

  const getCalInstance = React.useCallback(() => calendarRef.current.getInstance(), []);

  const updateRenderRangeText = React.useCallback(() => {
    const calInstance = getCalInstance();
    if (!calInstance) {
      setSelectedDateRangeText('');
    }

    const viewName = calInstance.getViewName();
    const calDate = calInstance.getDate();
    const rangeStart = calInstance.getDateRangeStart();
    const rangeEnd = calInstance.getDateRangeEnd();

    let year = calDate.getFullYear();
    let month = calDate.getMonth() + 1;
    let date = calDate.getDate();
    let dateRangeText = '';

    switch (viewName) {
      case 'month': {
        dateRangeText = `${year}-${month}`;
        break;
      }
      case 'week': {
        year = rangeStart.getFullYear();
        month = rangeStart.getMonth() + 1;
        date = rangeStart.getDate();
        const endMonth = rangeEnd.getMonth() + 1;
        const endDate = rangeEnd.getDate();

        const start = `${year}-${month < 10 ? '0' : ''}${month}-${date < 10 ? '0' : ''}${date}`;
        const end = `${year}-${endMonth < 10 ? '0' : ''}${endMonth}-${
          endDate < 10 ? '0' : ''
        }${endDate}`;
        dateRangeText = `${start} ~ ${end}`;
        break;
      }
      default:
        dateRangeText = `${year}-${month}-${date}`;
    }

    setSelectedDateRangeText(dateRangeText);
  }, []);

  React.useEffect(() => {
    setSelectedView(view);
  }, [view]);

  React.useEffect(() => {
    updateRenderRangeText();
  }, [selectedView, updateRenderRangeText]);

  const onAfterRenderSchedule = (res) => {
    console.group('onAfterRenderSchedule');
    console.log('Schedule Info : ', res.schedule);
    console.groupEnd();
  };

  const onBeforeDeleteSchedule = (res) => {
    console.group('onBeforeDeleteSchedule');
    console.log('Schedule Info : ', res.schedule);
    console.groupEnd();

    const {id, calendarId} = res.schedule;

    getCalInstance().deleteSchedule(id, calendarId);
  };

  const onChangeSelect = (ev) => {
    setSelectedView(ev.target.value);
  };

  const onClickDayName = (res) => {
    console.group('onClickDayName');
    console.log('Date : ', res.date);
    console.groupEnd();
  };

  const onClickNavi = (ev) => {
    if (ev.target.tagName === 'BUTTON') {
      const {target} = ev;
      const actionName = target.getAttribute('data-action').replace('move-', '');
      getCalInstance()[actionName]();
      updateRenderRangeText();
    }
  };

  const onClickSchedule = (res) => {
    console.group('onClickSchedule');
    console.log('MouseEvent : ', res.event);
    console.log('Calendar Info : ', res.calendar);
    console.log('Schedule Info : ', res.schedule);
    console.groupEnd();
  };

  const onClickTimezonesCollapseBtn = (timezoneCollapsed) => {
    console.group('onClickTimezonesCollapseBtn');
    console.log('Is Timezone Collapsed?: ', timezoneCollapsed);
    console.groupEnd();

    const newTheme = {
      'week.daygridLeft.width': '100px',
      'week.timegridLeft.width': '100px'
    };

    getCalInstance().setTheme(newTheme);
  };

  const onBeforeUpdateSchedule = (updateData) => {
    console.group('onBeforeUpdateSchedule');
    console.log(updateData);
    console.groupEnd();
    const targetSchedule = updateData.schedule;
    const changes = {
      start: updateData.start,
      end: updateData.end,
      ...(updateData.changes || {})
    };

    getCalInstance().updateSchedule(targetSchedule.id, targetSchedule.calendarId, changes);
  };

  const onBeforeCreateSchedule = (scheduleData) => {
    const schedule = {
      calendarId: scheduleData.calendarId || '',
      id: String(Math.random()),
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: scheduleData.start,
      end: scheduleData.end,
      category: scheduleData.isAllDay ? 'allday' : 'time',
      dueDateClass: '',
      location: scheduleData.location,
      state: scheduleData.state,
      isPrivate: scheduleData.isPrivate
    };

    getCalInstance().createSchedules([schedule]);
  };

  return (
    <div>
      <h1>🍞📅 TOAST UI Calendar + React.js</h1>
      <div>
        <select onChange={onChangeSelect} value={selectedView}>
          {viewModeOptions.map((option, index) => (
            <option value={option.value} key={index}>
              {option.title}
            </option>
          ))}
        </select>
        <span>
          <button
            type="button"
            className="btn btn-default btn-sm move-today"
            data-action="move-today"
            onClick={onClickNavi}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            data-action="move-prev"
            onClick={onClickNavi}
          >
            Prev
          </button>
          <button
            type="button"
            className="btn btn-default btn-sm move-day"
            data-action="move-next"
            onClick={onClickNavi}
          >
            Next
          </button>
        </span>
        <span className="render-range">{selectedDateRangeText}</span>
      </div>
      <Calendar
        usageStatistics={false}
        calendars={initialCalendars}
        defaultView={selectedView}
        disableDblClick={true}
        height="900px"
        isReadOnly={false}
        month={{
          startDayOfWeek: 2
        }}
        schedules={initialSchedules}
        scheduleView
        taskView
        template={{
          milestone(schedule) {
            return `<span style="color:#fff;background-color: ${schedule.bgColor};">${
              schedule.title
            }</span>`;
          },
          milestoneTitle() {
            return 'Milestone';
          },
          allday(schedule) {
            return `${schedule.title}<i class="fa fa-refresh"></i>`;
          },
          alldayTitle() {
            return 'All Day';
          }
        }}
        theme={myTheme}
        timezones={[
          {
            timezoneOffset: 540,
            displayLabel: 'GMT+09:00',
            tooltip: 'Seoul'
          },
          {
            timezoneOffset: -420,
            displayLabel: 'GMT-08:00',
            tooltip: 'Los Angeles'
          }
        ]}
        useDetailPopup
        useCreationPopup
        view={selectedView}
        week={{
          showTimezoneCollapseButton: true,
          timezonesCollapsed: false
        }}
        ref={calendarRef}
        onAfterRenderSchedule={onAfterRenderSchedule}
        onBeforeDeleteSchedule={onBeforeDeleteSchedule}
        onClickDayname={onClickDayName}
        onClickSchedule={onClickSchedule}
        onClickTimezonesCollapseBtn={onClickTimezonesCollapseBtn}
        onBeforeUpdateSchedule={onBeforeUpdateSchedule}
        onBeforeCreateSchedule={onBeforeCreateSchedule}
      />
    </div>
  );
}

export default {
  title: 'Wrapper Examples',
  component: Calendar
};

export const WithClassComponent = (args) => <ClassComponent {...args} />;
WithClassComponent.args = {
  view: 'month'
};
WithClassComponent.argTypes = {
  view: {
    control: {
      type: 'select',
      options: ['month', 'week', 'day']
    }
  }
};

export const WithFunctionComponent = (args) => <FunctionComponent {...args} />;
WithFunctionComponent.args = {
  view: 'month'
};
WithFunctionComponent.argTypes = {
  view: {
    control: {
      type: 'select',
      options: ['month', 'week', 'day']
    }
  }
};
