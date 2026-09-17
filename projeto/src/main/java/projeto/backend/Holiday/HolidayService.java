package projeto.backend.Holiday;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class HolidayService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String URL =
            "https://date.nager.at/api/v3/PublicHolidays/2026/BR";

    public boolean isHoliday(LocalDate date) {

        Holiday[] holidays = restTemplate.getForObject(URL, Holiday[].class);

        if (holidays == null) {
            return false;
        }

        List<Holiday> list = Arrays.asList(holidays);

        return list.stream().anyMatch(holiday -> holiday.getDate().equals(date.toString()));
    }
}