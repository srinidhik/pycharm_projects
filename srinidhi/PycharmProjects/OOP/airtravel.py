"""model"""

class Flight:

    def __init__(self,number,aircraft):
        if not number[:2].isalpha():
            raise ValueError("No airline code {}".format(number))

        if not number[:2].isupper():
            raise ValueError("No airline code {}".format(number))

        if not (number[2:].isdigit() and int(number[2:])<=9999):
            raise ValueError("No airline code {}".format(number))

        self._number=number
        self._aircraft=aircraft

    def number(self):
        return self._number

    def aircraft_model(self):
        return self._aircraft.model()

class Aircraft:

    def __init__(self,registration,model,rows,rows_col):
        self._registration=registration
        self._model=model
        self._rows=rows
        self._rows_col=rows_col

    def registration(self):
        return self._registration

    def model(self):
        return self._model

    def seat(self):
        return (range(1,self._rows + 1), "ABCDEFGHJK"[:self._rows_col])
