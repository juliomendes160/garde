package projeto.backend.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<LocalTime>> available(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(appointmentService.available(date));
    }

    // @GetMapping("/available")
    // public ResponseEntity<List<LocalTime>> available(@RequestParam LocalDate date) {

    //     return ResponseEntity.ok(
    //         appointmentService.getAvailableTimes(date)
    //     );
    // }

    @PostMapping()
    public ResponseEntity<Appointment> save(@RequestBody Appointment appointment) {

        return ResponseEntity.ok(appointmentService.save(appointment));
    }

    @GetMapping()
    public ResponseEntity<List<Appointment>> findAll() {
 
        return ResponseEntity.ok(appointmentService.findAll());
    }
}