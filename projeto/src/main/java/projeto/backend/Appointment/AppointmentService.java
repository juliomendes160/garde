package projeto.backend.Appointment;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import projeto.backend.Holiday.HolidayService;

@Service
public class AppointmentService {

    private final AppointmentRepository appoinmentRepository;

    private final HolidayService holidayService;

    public AppointmentService(
        AppointmentRepository appoinmentRepository,
        HolidayService holidayService) {

        this.appoinmentRepository = appoinmentRepository;
        this.holidayService = holidayService;
    }

    public List<LocalTime> available(LocalDate date) {

        validateDate(date);

        List<LocalTime> available = new ArrayList<>();

        LocalTime time = LocalTime.of(8, 0);
        LocalTime end = LocalTime.of(18, 0);

        while (time.isBefore(end)) {

            if (!appoinmentRepository.existsByDateAndTime(date, time)) {
                available.add(time);
            }

            time = time.plusHours(1);
        }

        return available;
    }

    public Appointment save(Appointment appointment) {

        validateDate(appointment.getDate());

        if (appointment.getTime().isBefore(LocalTime.of(8, 0)) || !appointment.getTime().isBefore(LocalTime.of(18, 0)) || appointment.getTime().getMinute() != 0 || appointment.getTime().getSecond() != 0 || appointment.getTime().getNano() != 0) {
            throw new RuntimeException("Horário deve estar entre 08:00 e 17:00");
        }

        if (appoinmentRepository.existsByDateAndTime(appointment.getDate(), appointment.getTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Horário já está ocupado");
        }

        return appoinmentRepository.save(appointment);
    }

    public List<Appointment> findAll() {

        return appoinmentRepository.findAll();
    }

    private void validateDate(LocalDate date) {

        DayOfWeek day = date.getDayOfWeek();

        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            throw new RuntimeException("Não é possível agendar aos finais de semana");
        }

        if (holidayService.isHoliday(date)) {
            throw new RuntimeException("Não é possível agendar em feriados");
        }
    }
}