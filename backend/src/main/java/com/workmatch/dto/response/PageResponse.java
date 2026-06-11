package com.workmatch.dto.response;

import org.springframework.data.domain.Page;

import java.util.List;

/*
 * Envelope de paginação retornado em todos os endpoints paginados.
 * Campos alinhados com o padrão Spring Data Page para facilitar
 * o consumo no frontend web e no futuro app mobile.
 */
public record PageResponse<T>(
        List<T>  content,
        int      page,
        int      size,
        long     totalElements,
        int      totalPages,
        boolean  first,
        boolean  last
) {
    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
