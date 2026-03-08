package com.msfg.dashboard.controller;

import com.msfg.dashboard.model.entity.MondayBoard;
import com.msfg.dashboard.service.MondayService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/monday")
public class MondayController {

    private final MondayService mondayService;

    public MondayController(MondayService mondayService) {
        this.mondayService = mondayService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getEvents() {
        return ResponseEntity.ok(mondayService.getEvents());
    }

    @GetMapping("/boards")
    public ResponseEntity<List<MondayBoard>> listBoards() {
        return ResponseEntity.ok(mondayService.findAllBoards());
    }

    @PostMapping("/boards")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MondayBoard> createBoard(@Valid @RequestBody MondayBoard board) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mondayService.createBoard(board));
    }

    @PutMapping("/boards/{boardId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MondayBoard> updateBoard(@PathVariable String boardId,
                                                    @Valid @RequestBody MondayBoard board) {
        return ResponseEntity.ok(mondayService.updateBoard(boardId, board));
    }

    @DeleteMapping("/boards/{boardId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteBoard(@PathVariable String boardId) {
        mondayService.deleteBoard(boardId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
