package org.vinhduyle.superdupermart.dto;

import lombok.Data;
import lombok.Getter;

import javax.validation.constraints.NotEmpty;
import java.util.List;
@Getter
@Data
public class OrderRequest {
    @NotEmpty
    private List<OrderItemRequest> order;
}
