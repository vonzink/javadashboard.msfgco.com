package com.msfg.dashboard.service;

import com.msfg.dashboard.exception.ResourceNotFoundException;
import com.msfg.dashboard.model.entity.MondayBoard;
import com.msfg.dashboard.repository.MondayBoardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class MondayService {

    private final MondayBoardRepository mondayBoardRepository;

    public MondayService(MondayBoardRepository mondayBoardRepository) {
        this.mondayBoardRepository = mondayBoardRepository;
    }

    public List<Map<String, Object>> getEvents() {
        // Returns board data formatted as events for the dashboard
        List<MondayBoard> boards = mondayBoardRepository.findAll();
        return boards.stream()
                .filter(b -> b.getEnabled() != null && b.getEnabled())
                .map(board -> Map.<String, Object>of(
                        "boardId", board.getBoardId(),
                        "boardName", board.getBoardName() != null ? board.getBoardName() : "",
                        "enabled", true
                ))
                .toList();
    }

    public List<MondayBoard> findAllBoards() {
        return mondayBoardRepository.findAll();
    }

    @Transactional
    public MondayBoard createBoard(MondayBoard board) {
        return mondayBoardRepository.save(board);
    }

    @Transactional
    public MondayBoard updateBoard(String boardId, MondayBoard updates) {
        MondayBoard board = mondayBoardRepository.findByBoardId(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("MondayBoard", boardId));

        if (updates.getBoardName() != null) board.setBoardName(updates.getBoardName());
        if (updates.getColumnMappings() != null) board.setColumnMappings(updates.getColumnMappings());
        if (updates.getEnabled() != null) board.setEnabled(updates.getEnabled());

        return mondayBoardRepository.save(board);
    }

    @Transactional
    public void deleteBoard(String boardId) {
        MondayBoard board = mondayBoardRepository.findByBoardId(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("MondayBoard", boardId));
        mondayBoardRepository.delete(board);
    }
}
