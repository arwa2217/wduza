const overrides = {
  MuiCardHeader: {
    action: {
      marginTop: '-4px',
      marginRight: '-4px',
    },
  },
  MuiPickersDay: {
    day: {
      fontWeight: '300',
    },
  },
  MuiPickersYear: {
    root: {
      height: '64px',
    },
  },
  MuiPickersCalendar: {
    transitionContainer: {
      marginTop: '6px',
    },
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: 'transparent',
      '& > *': {
        backgroundColor: 'transparent',
      },
    },
    switchHeader: {
      marginTop: '2px',
      marginBottom: '4px',
    },
  },
  MuiPickersClock: {
    container: {
      margin: '32px 0 4px',
    },
  },
  MuiPickersClockNumber: {
    clockNumber: {
      left: 'calc(50% - 16px)',
      width: '32px',
      height: '32px',
    },
  },
  MuiPickerDTHeader: {
    dateHeader: {
      '& h4': {
        fontSize: '2.125rem',
        fontWeight: 400,
      },
    },
    timeHeader: {
      '& h3': {
        fontSize: '3rem',
        fontWeight: 400,
      },
    },
  },
  MuiPickersTimePicker: {
    hourMinuteLabel: {
      '& h2': {
        fontSize: '3.75rem',
        fontWeight: 300,
      },
    },
  },
  MuiPickersToolbar: {
    toolbar: {
      '& h4': {
        fontSize: '2.125rem',
        fontWeight: 400,
      },
    },
  },
  MuiOutlinedInput: {
    root: {
      borderRadius: 0,
    },
    input: {
      padding: 12.82,
    },
  },
  MuiFormControl: {
    root: {
      width: '100%',
    },
  },
  MuiTypography: {
    h3: {
      textAlign: 'center',
    },
  },
  MuiInputLabel: {
    outlined: {
      transform: 'translate(10px, 15px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -5px) scale(0.75)',
      },
    },
    shrink: {
      height: 10,
      backgroundColor: 'white',
      padding: '0 5px',
    },
  },
  MuiTableCell: {
    head: {
      backgroundColor: '#DEE8FF',
      color: '#4F4B66',
      border: '1px solid #ccc',
    },
    body: {
      fontSize: 14,
      border: '1px solid #ccc',
    },
  },
  MuiInput: {
    input: {
      "&::placeholder": {
        color: "red"
      },
    }
  }
};

export default overrides;
